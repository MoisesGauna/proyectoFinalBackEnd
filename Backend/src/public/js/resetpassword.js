const resetForm = document.getElementById("resetPswForm");
let token = window.location.href.split("/").pop();

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(resetForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  console.log(obj);
  fetch(`/api/settings/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) 
    Swal.fire({
      icon: "success",
      text: `Has modificado la contraseña exitosamente!!`,
      width: 400,
    }).then((result) => {
      window.location.replace("/");
    });
    if (result.status === 404)
      Swal.fire({
        icon: "error",
        text: `El enlace para resetear la contraseña ha expirado.

        Deberá volver a generarlo.`,
        width: 400,
      }).then((result) => {
        window.location.replace("/password-reset");
      });

    if (result.status === 400) {
      result.json().then((json) => {
        if (json.message === "Contraseñas diferentes") {
          Swal.fire({
            icon: "error",
            text: `Las contraseñas deben considir. 
            
            Vuelva a intentarlo.`,
            width: 400,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `La contraseña nueva, debe ser distinta a la constraseña actual.`,
            width: 400,
          });
        }
      });
    }
  });
});
