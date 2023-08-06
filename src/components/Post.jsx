import React from "react";

function Post({
  post,
  post: { id, titulo, img, descripcion, likes },
  like,
  eliminarPost,
}) {
  const handleImageError = (e) => {
    e.target.src = "imagen_no_disponible.jpg";
  };

  return (
    <div className="card col-12 col-sm-4 d-inline mx-0 px-3">
      <div className="card-body  p-0">
        <img className="card-img-top " src={img} onError={handleImageError} />
        <div className="p-3">
          <h4 className="card-title">{titulo}</h4>
          <p className="card-text">{descripcion}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i
                onClick={() => like(id)}
                className={`fa-heart fa-xl ${
                  likes ? "fa-solid" : "fa-regular"
                }`}
              ></i>
              <span className="ms-1">{likes}</span>
            </div>
            <i
              onClick={() => eliminarPost(id)}
              className="fas fa-times"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
