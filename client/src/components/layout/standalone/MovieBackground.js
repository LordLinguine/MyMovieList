import React from "react";

function MovieBackground(props) {
  // console.log(props.url);
  return (
    
    <div className="movie-background">
      <img src={props.url} alt="Movie Background" />
      
    </div>
  );
  
}

export default MovieBackground;
