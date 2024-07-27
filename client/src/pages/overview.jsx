import "../styles/pages/overview.css"

import { useEffect, useState } from "react";

import { BasicTopList } from "../components/BasicTopList"


export function OverviewPage({ category }) {

  const [topList, setTopList] = useState(null);
  useEffect(() => {
    setTopList(null);
    fetch(`/api/${category}/toplist/0`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTopList(data);
      });
  }, [category]);


  return (
    <>
      <div className="stats-page-container">
        <div className="top-stats">
          <h1>{`Your Top ${capitalise(category)}s`}</h1>
          <BasicTopList
            link={category}
            type={'overview'}
            topList={topList}
          />
        </div>
      </div>
    </>
  )
}


function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1)
}
