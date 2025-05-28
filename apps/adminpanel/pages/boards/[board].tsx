// pages/boards/[board].tsx
import BoardsPage from 'protolib/bundles/boards/adminPages'
import { useRouter } from 'next/router'

export default function Page(props: any) {
  const router = useRouter()
  const board = router.query.board

  if (!board || typeof board !== 'string') return <></>

  return <BoardsPage.view.component board={board} />
}