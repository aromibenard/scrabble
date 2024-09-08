import Board from '@/components/Board';
import TileRack from '@/components/TileRack';
import styles from '@/styles/board.module.css'

export default function Home() {
  return (
    <div className="w-dvw md:max-w-5xl mx-auto bg-green-200 p-4 ">
      <Board/>
      <TileRack/>
    </div>
  );
}
