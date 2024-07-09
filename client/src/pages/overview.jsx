import "./overview.css"

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { BasicTopList } from "../components/BasicTopList"


export function OverviewPage({ category }) {

  const [serachParams, setSearchParams] = useSearchParams();
  const rank = serachParams.get('rank');

  const [limit, setLimit] = useState(5);
  const [topList, setTopList] = useState(null);

  useEffect(() => {
    if (rank) {
      setLimit((Math.ceil(rank/5))*5);
    } else {
      setLimit(5);
    }
    setTopList(null);
  }, [category])

  useEffect(() => {
    fetch(`/api/toplist/${category}/0`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
        setTimeout(scrollTo, 50);
      });
  }, [category]);

  const scrollTo = function () {
    const element = document.getElementById("view-more");
    console.log(element)
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  const changeLimit = function(change) {
    setLimit(limit+change);

    serachParams.delete('rank');
    setSearchParams(serachParams);

    setTimeout(scrollTo, 50);
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
            rank={rank}
          />
          {topList &&
            <div className="view-control">
              {(limit > 5) ?
                <span
                  id="view-less"
                  onClick={() => {changeLimit(-5)}}>
                    view less
                </span>
                : <span></span>}
              {(limit <= topList.length) ?
                <span
                  id="view-more"
                  onClick={() => {changeLimit(+5)}}>
                    view more
                </span>
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
