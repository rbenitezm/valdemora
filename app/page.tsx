import Game from './game';

export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return <Game />;
}
