const params = new URLSearchParams(window.location.search);
const orgId = params.get("id");

fetch(`http://localhost:8010/proxy/orgs/get?org_uuid=${orgId}`, {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("accessToken")}`,
    },
    accept: "application/json",
})
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Error");
        }
    })
    .then(function (data) {
        console.log(data);
        document.getElementById("org-name").innerHTML = data.OrganizationName;
        document.getElementById("org-des").innerHTML =
            data.OrganizationDescription;
        document.getElementById(
            "org-logo"
        ).src = `data:image/png;base64,${data.OrganizationAvatar}`;
    })
    .catch(function (error) {
        console.log(error);
    });
