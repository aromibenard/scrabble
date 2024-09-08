import Board from '@/components/Board';
import TileRack from '@/components/TileRack';
import styles from '@/styles/board.module.css'

export default function Home() {
  return (
    <div className="">
      <Board/>
      <TileRack/>
    </div>
  );
}
