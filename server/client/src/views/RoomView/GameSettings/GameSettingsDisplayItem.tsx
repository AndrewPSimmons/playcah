import React from 'react'

export default function GameSettingsDisplayItem({entry}: any) {
  return (
    <div>{entry[0]} - {JSON.stringify(entry[1])}</div>
  )
}
