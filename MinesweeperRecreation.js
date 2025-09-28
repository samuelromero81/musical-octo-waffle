import React, { useState } from "react";
const N = 8, MINES = 10;
function makeBoard() {
  let board = Array(N*N).fill(0).map(_=>({mine:false,adj:0,revealed:false,flag:false}));
  let mines = 0;
  while (mines < MINES) {
    let i = Math.floor(Math.random() * N * N);
    if (!board[i].mine) { board[i].mine=true; mines++; }
  }
  for (let i=0;i<N*N;i++) {
    if (board[i].mine) continue;
    let x=i%N,y=Math.floor(i/N);
    for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
      let nx=x+dx,ny=y+dy;
      if (nx>=0&&nx<N&&ny>=0&&ny<N&&board[ny*N+nx].mine) board[i].adj++;
    }
  }
  return board;
}
export default function MinesweeperRecreation() {
  const [board, setBoard] = useState(makeBoard());
  const [lost, setLost] = useState(false);
  function reveal(i) {
    if (board[i].flag||board[i].revealed) return;
    if (board[i].mine) { setLost(true); return; }
    let newB = [...board];
    let stack = [i];
    while (stack.length) {
      let idx = stack.pop();
      if (newB[idx].revealed||newB[idx].flag) continue;
      newB[idx].revealed=true;
      if (newB[idx].adj===0) {
        let x=idx%N,y=Math.floor(idx/N);
        for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
          let nx=x+dx,ny=y+dy;
          if (nx>=0&&nx<N&&ny>=0&&ny<N) stack.push(ny*N+nx);
        }
      }
    }
    setBoard(newB);
  }
  function flag(i,e) {
    e.preventDefault();
    if (board[i].revealed) return;
    let newB=[...board]; newB[i].flag=!newB[i].flag; setBoard(newB);
  }
  function reset() { setBoard(makeBoard()); setLost(false); }
  return (
    <div style={{margin:40}}>
      <h1>Minesweeper Recreation</h1>
      <button onClick={reset}>New Game</button>
      <div style={{
        display:"grid",gridTemplateColumns:`repeat(${N},32px)`,marginTop:20
      }}>
        {board.map((c,i)=>
          <div key={i} onClick={()=>reveal(i)}
            onContextMenu={e=>flag(i,e)}
            style={{
              width:32,height:32,border:"1px solid #333",background:c.revealed?"#ddd":"#888",
              display:"flex",justifyContent:"center",alignItems:"center",fontWeight:"bold",cursor:"pointer"
            }}>
            {c.revealed ? (c.mine?"💣":c.adj||"") : (c.flag?"🚩":"")}
          </div>
        )}
      </div>
      {lost && <div style={{color:"red"}}>Game Over!</div>}
    </div>
  );
}