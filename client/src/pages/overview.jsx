import "./overview.css"

import { useEffect, useState } from "react";

import { BasicTopList } from "../components/BasicTopList"


export function OverviewPage({ category }) {

  const [limit, setLimit] = useState(5);
  const [topList, setTopList] = useState(null);

  useEffect(() => {
    setLimit(5);
    setTopList(null);
  }, [category])

  useEffect(() => {
    fetch(`/api/toplist/${category}/0`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
      });
  }, [category]);

  const scrollTo = function () {
    const element = document.getElementById("view-more");
    console.log(element)
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <>
      <div className="stats-page-container">
        <div className="top-stats">
          <h1>{`Your Top ${capitalise(category)}s`}</h1>
          <BasicTopList
            type={category}
            limit={limit}
            topList={topList}
          />
          {topList &&
            <div className="view-control">
              {(limit > 5) ?
                <span  id="view-less" onClick={() => {setLimit(limit-5)}}>view less</span>
                : <span></span>}
              {(limit <= topList.length) ?
                <span id="view-more" onClick={() => {setLimit(limit+5); setTimeout(scrollTo, 50);}}>view more</span>
                : <span></span>}
            </div>          
          }
        </div>
      </div>
    </>
  )
}


function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1)
}
