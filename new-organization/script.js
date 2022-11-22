if (localStorage.getItem("accessToken") === null) {
    window.location.href = "/login";
}

$(".imgAdd").click(function () {
    $(this)
        .closest(".row")
        .find(".imgAdd")
        .before(
            '<div class="col-sm-2 imgUp"><div class="imagePreview"></div><label class="btn btn-primary">Upload<input type="file" class="uploadFile img" value="Upload Photo" style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i></div>'
        );
});

$(document).on("click", "i.del", function () {
    $(this).parent().remove();
});

$(function () {
    $(document).on("change", ".uploadFile", function () {
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) {
            console.log("No file selected.");
            return; // no file selected, or no FileReader support
        }

        if (/^image/.test(files[0].type)) {
            // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function () {
                // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile
                    .closest(".imgUp")
                    .find(".imagePreview")
                    .css("background-image", "url(" + this.result + ")");
            };
        }
    });
});

document
    .getElementById("post-organization")
    .addEventListener("click", function () {
        let organizationName =
            document.getElementById("organization-name").value;
        let organizationDescription = document.getElementById(
            "organization-description"
        ).value;
        let organizationLogo = document
            .getElementById("organization-logo")
            .style.backgroundImage.split("base64,")[1]
            .slice(0, -2);

        let organization = {
            OrganizationName: organizationName,
            OrganizationDescription: organizationDescription,
            OrganizationAvatar: organizationLogo,
        };

        fetch("http://localhost:8010/proxy/orgs/create", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
            accept: "application/json",
            body: JSON.stringify(organization),
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
                window.location.href = "/profile?id=me";
            })
            .catch(function (error) {
                console.log(error);
            });
    });
