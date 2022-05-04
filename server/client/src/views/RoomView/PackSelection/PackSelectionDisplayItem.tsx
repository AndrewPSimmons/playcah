import React from 'react'

export default function PackSelectionDisplayItem({pack}: any) {
  return (
    <div>{pack.name} - {pack.card_count}</div>
  )
}
