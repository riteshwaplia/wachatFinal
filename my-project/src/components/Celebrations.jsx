

import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti-boom';

const Celebrations = ({ showConfetti, setShowConfetti }) => {
  //     useEffect(()=>
  //     {
  // setTimeout(() => {
  //     setInterval
  // }, timeout);(() => {
  //     setShowConfetti(false);
  // }, 4000);
  //  return () => clearTimeout(timer);
  //     },[])
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [])
  return (
    <div>
      {
        showConfetti && (
          <Confetti mode='fall' effectInterval={0.50} effectCount={1} launchSpeed={1} shapeSize={10} colors={["#4AA4D7", "#ff577f", '#ff884b', '#ffd384', '#fff9b0']} particleCount={150} />
        )
      }
    </div>
  )
}
export default Celebrations;