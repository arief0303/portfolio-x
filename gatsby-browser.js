import * as React from "react"
import { GlobalCanvas } from '@14islands/r3f-scroll-rig'
import "./src/styles/global.css"

export const wrapRootElement = ({ element }) => (
  <>
    <GlobalCanvas style={{ zIndex: -1 }}>
    <ambientLight />
    </GlobalCanvas>
    {element}
  </>
)