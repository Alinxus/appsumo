import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

// Handle purchase fulfillment based on tool's fulfillment method
export async function POST(request: NextRequest) {
  try {
    const { purchaseId, toolId, customerEmail } = await request.json()

    if (!purchaseId || !toolId || !customerEmail) {
      return NextResponse.json(
        { error: 'Purchase ID, tool ID, and customer email are required' },
        { status: 400 }
      )
    }

    const tool = await db.aiTool.findUnique({
      where: { id: toolId },
      include: { vendor: true }
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    const purchase = await db.purchase.findUnique({
      where: { id: purchaseId },
      include: { user: true, tool: true }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    let fulfillmentData: any = {
      method: tool.fulfillmentMethod,
      instructions: tool.fulfillmentInstructions
    }

    switch (tool.fulfillmentMethod) {
      case 'BULK_KEYS':
        // Get an unused license key
        const availableKey = await db.licenseKey.findFirst({
          where: {
            toolId: toolId,
            isUsed: false
          }
        })

        if (!availableKey) {
          // Notify vendor they're out of keys
          fulfillmentData = {
            method: 'MANUAL_FULFILLMENT',
            error: 'No license keys available',
            instructions: 'Our team will manually provision your access within 24 hours.',
            vendorNotified: true
          }
          break
        }

        // Mark key as used
        await db.licenseKey.update({
          where: { id: availableKey.id },
          data: {
            isUsed: true,
            usedBy: purchase.userId,
            usedAt: new Date()
          }
        })

        // Update tool's used licenses count
        await db.aiTool.update({
          where: { id: toolId },
          data: {
            usedLicenses: { increment: 1 }
          }
        })

        fulfillmentData = {
          method: 'BULK_KEYS',
          licenseKey: availableKey.keyValue,
          instructions: tool.fulfillmentInstructions,
          websiteUrl: tool.websiteUrl,
          redemptionUrl: tool.redemptionUrl
        }
        break

      case 'COUPON_CODE':
        fulfillmentData = {
          method: 'COUPON_CODE',
          couponCode: tool.couponCode,
          redemptionUrl: tool.redemptionUrl,
          instructions: tool.fulfillmentInstructions,
          websiteUrl: tool.websiteUrl
        }
        break

      case 'API_PROVISION':
        // Call vendor's API to provision account
        try {
          const apiResponse = await fetch(tool.apiWebhookUrl!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-AIsumo-Signature': 'webhook-signature-here' // TODO: Add proper signature
            },
            body: JSON.stringify({
              purchase_id: purchaseId,
              customer_email: customerEmail,
              customer_name: purchase.user.fullName,
              tool_id: toolId,
              tool_name: tool.name,
              price_paid: purchase.pricePaid,
              purchase_date: purchase.createdAt,
              source: 'aisumo'
            })
          })

          if (apiResponse.ok) {
            const apiData = await apiResponse.json()
            fulfillmentData = {
              method: 'API_PROVISION',
              success: true,
              loginUrl: apiData.login_url || tool.websiteUrl,
              username: apiData.username,
              password: apiData.password,
              instructions: tool.fulfillmentInstructions,
              apiResponse: apiData
            }
          } else {
            throw new Error('API provision failed')
          }
        } catch (error) {
          console.error('API provisioning failed:', error)
          fulfillmentData = {
            method: 'MANUAL_FULFILLMENT',
            error: 'API provisioning failed',
            instructions: 'Our team will manually provision your access within 24 hours.',
            vendorNotified: true
          }
        }
        break

      case 'MANUAL_FULFILLMENT':
      default:
        fulfillmentData = {
          method: 'MANUAL_FULFILLMENT',
          instructions: tool.fulfillmentInstructions || 'You will receive access instructions within 24-48 hours via email.',
          vendorEmail: tool.vendor.email,
          estimatedTime: '24-48 hours'
        }
        break
    }

    // Update purchase with fulfillment data
    await db.purchase.update({
      where: { id: purchaseId },
      data: {
        status: fulfillmentData.error ? 'PENDING' : 'COMPLETED',
        licenseKey: fulfillmentData.licenseKey || null,
        accessInstructions: JSON.stringify(fulfillmentData)
      }
    })

    return NextResponse.json({
      success: true,
      fulfillment: fulfillmentData,
      message: getFulfillmentMessage(tool.fulfillmentMethod, fulfillmentData)
    })

  } catch (error) {
    console.error('Error fulfilling purchase:', error)
    return NextResponse.json(
      { error: 'Failed to fulfill purchase' },
      { status: 500 }
    )
  }
}

function getFulfillmentMessage(method: string, data: any): string {
  switch (method) {
    case 'BULK_KEYS':
      return data.error 
        ? 'We\'re processing your order manually. You\'ll receive access within 24 hours.'
        : 'Your license key has been generated! Check your email for access instructions.'
    
    case 'COUPON_CODE':
      return `Use coupon code "${data.couponCode}" at checkout to get your lifetime deal!`
    
    case 'API_PROVISION':
      return data.error
        ? 'We\'re setting up your account manually. You\'ll receive login details within 24 hours.'
        : 'Your account has been created! Check your email for login instructions.'
    
    case 'MANUAL_FULFILLMENT':
    default:
      return 'Your purchase is confirmed! Our team will send you access instructions within 24-48 hours.'
  }
} 