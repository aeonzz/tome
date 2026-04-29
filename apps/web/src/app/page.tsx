import * as React from "react"

import { BentoFeatures } from "@/components/bento-features"
import { Hero } from "@/components/hero"
import { PreFooter } from "@/components/pre-footer"

export default function Home() {
  return (
    <React.Fragment>
      <Hero />
      <BentoFeatures />
      <PreFooter />
    </React.Fragment>
  )
}
