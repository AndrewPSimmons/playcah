import React from 'react'

export default function RoomSettingsDisplayItem({entry}: any) {
  return (
    <div>{entry[0]} - {JSON.stringify(entry[1])}</div>
  )
}
