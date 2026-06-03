import "./MainContainer.css"
import HeroHeading from "./HeroHeading"
import SearchBar from "./SearchBar"
import Filters from "./Filters"
import AllJobs from "./AllJobs"
import { useState } from "react"

export default function MainContainer() {
  const [filterParams, setFilterParams] = useState({})

  return (
    <div className="container">
      <HeroHeading />
      <SearchBar />
      <div className="filters_Posts">
        <Filters onFilterChange={(params) => setFilterParams(params)} />
        <AllJobs filterParams={filterParams} />
      </div>
    </div>
  )
}