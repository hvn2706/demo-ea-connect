function login() {
    var email = $("#email").val();
    var password = $("#password").val();
    var url_login = "http://localhost:8010/proxy/user/login";
    var data = {
        username: email,
        password: password,
    };

    var formBody = [];

    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(url_login, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        accept: "application/json",
        body: formBody,
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.access_token !== undefined) {
                localStorage.setItem("accessToken", data.access_token);
                window.location.href = "/home";
            } else {
                alert("Wrong email or password");
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    // url_bearer = "http://localhost:8010/proxy/profile/me";
    // fetch(url_bearer, {
    //     method: "GET",
    //     mode: "cors",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `bearer ${localStorage.getItem("accessToken")}`,
    //     },
    // })
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         console.log(data);
    //         localStorage.setItem("userId", JSON.stringify(data.UUID));
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
}

document.getElementById("loginButton").onclick = login;
