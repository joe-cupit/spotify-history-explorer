import "../styles/components/RankBadge.css";

export function RankBadge({ rank }) {

  const formatNumber = function(rank) {
    var fontSize = 14;
    switch (rank.toString().length) {
      case 1:
        fontSize = 33;
        break;
      case 2:
        fontSize = 30;
        break;
      case 3:
        fontSize = 25;
        break;
      case 4:
        fontSize = 20;
        break;
      case 5:
        fontSize = 16;
        break;
      default:
        fontSize = 14;
    }

    var bgcol = null;
    switch (rank) {
      case 1:
        bgcol = '#d4af37';
        break;
      case 2:
        bgcol = '#c0c0c0';
        break;
      case 3:
        bgcol = '#cd7f32';
        break;
      default:
        bgcol = null;
    }

    const rankText = '#' + rank.toLocaleString();
    const rankStyle = {
      fontSize: fontSize,
      backgroundColor: bgcol
    };

    return (
      <div style={rankStyle} className="rank-badge">
        {rankText}
      </div>
    )
  }


  return (
      <>
        {formatNumber(rank)}
      </>
  )
}