import { NextRequest, NextResponse } from 'next/server'
import { requireVendor } from '@/lib/auth'
import { db } from '@/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireVendor()
  const tool = await db.aiTool.findUnique({ where: { id: params.id } })
  if (!tool || tool.vendorId !== user.profile!.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const body = await req.json()
  const updated = await db.aiTool.update({
    where: { id: params.id },
    data: { status: body.status }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireVendor()
  const tool = await db.aiTool.findUnique({ where: { id: params.id } })
  if (!tool || tool.vendorId !== user.profile!.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  await db.aiTool.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
} 