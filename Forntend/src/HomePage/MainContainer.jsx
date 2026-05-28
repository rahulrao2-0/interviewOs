
import "./MainContainer.css"
import HeroHeading from "./HeroHeading"
import SearchBar from "./SearchBar"
import Filters from "./Filters"

import AllJobs from "./AllJobs"

export default function MainContainer (){
    return(
        
        <div className="container">
            <HeroHeading/>
             <SearchBar/>
             <div className="filters_Posts">
                <Filters></Filters>
                <AllJobs/>
             </div>
             
             
        </div>
        
    )
}