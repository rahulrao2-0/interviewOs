import "./MainContainer.css"
import HeroHeading from "./HeroHeading"
import SearchBar from "./SearchBar"
import Filters from "./Filters"
import AllJobs from "./AllJobs"
import { useState } from "react"

export default function MainContainer() {
  const [filterParams, setFilterParams] = useState({})

  const handleSearch = (searchData) => {
    setFilterParams((prev) => {
      const updated = { ...prev };
      if (searchData.query) {
        updated.search = searchData.query;
      } else {
        delete updated.search;
      }
      if (searchData.location) {
        updated.location = searchData.location;
      } else {
        delete updated.location;
      }
      return updated;
    });
  };

  return (
    <div className="container">
      <HeroHeading />
      <SearchBar onSearch={handleSearch} />
      <div className="filters_Posts">
        <Filters onFilterChange={(params) => setFilterParams((prev) => ({ ...prev, ...params }))} />
        <AllJobs filterParams={filterParams} />
      </div>
    </div>
  )
}