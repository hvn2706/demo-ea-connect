function getTimeDescriptionFromSeconds(seconds) {
    let minute = 60;
    let hour = minute * 60;

    if (seconds < minute) {
        return `Just now`;
    }

    if (seconds > minute && seconds < hour) {
        return `${Math.floor(seconds / minute)} minutes ago`;
    }

    return `${Math.floor(seconds / hour)} hours ago`;
}

async function getLikeList(jobDescriptionId) {
    // Giang's job: change this to POST method and send the id of the job description, then GET the list of likes
    var like_lists = await fetch(
        `http://localhost:8010/proxy/interactions/like?post_uuid=${jobDescriptionId}`,
        {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data;
        });
    return like_lists;
}

function getCommentList(jobDescriptionId) {
    // Giang's job: change this to POST method and send the id of the job description, then GET the list of likes
    fetch(
        `http://localhost:8010/proxy/interactions/comment?post_uuid=${jobDescriptionId}&limit=10&offset=0`,
        {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            createCommentListContainer(data, jobDescriptionId);
        });
}

function createLikeListContainer(likeList) {
    let likeListHTML = document.createElement("div");
    likeListHTML.innerHTML += `<div> Likes: ${likeList.length}</div>`;
    for (let i = 0; i < likeList.length; i++) {
        let likeItem = document.createElement("div");
        likeItem.setAttribute("class", "container");
        likeItem.innerHTML = `
            <div class=row style="margin-bottom:10px;">
                <div class="col-md-2">
                    <img src="data:image/png;base64,${likeList[i].LikeOwnerAvatar}" alt="John" style="width:100%">
                </div>
                <div class="col-md-5">
                    <a class="nav-item" href="/profile/?id=${likeList[i].LikeOwner}" style="text-decoration: none;color: inherit;">
                        ${likeList[i].LikeOwnerName} 
                    </a>
                </div>
            </div>
        `;
        likeListHTML.appendChild(likeItem);
    }

    let likeModal = document.getElementById("likeModalBody");
    likeModal.removeChild(likeModal.childNodes[0]);
    likeModal.appendChild(likeListHTML);
}

function createCommentListContainer(commentList, jobDescriptionId) {
    let commentListHTML = document.createElement("div");
    for (let i = 0; i < commentList.length; i++) {
        let commentItem = document.createElement("div");
        commentItem.setAttribute("class", "card");
        commentItem.setAttribute("style", "padding: 10px");
        commentItem.innerHTML = `
        <div class="card-header">
            <img src="data:image/png;base64,${commentList[i].CommentOwnerAvatar}" alt="John" style="width:5%">
            &nbsp;
            <a class="nav-item" href="/profile/?id=${commentList[i].CommentOwner}" style="text-decoration: none;color: inherit;">
                ${commentList[i].CommentOwnerName} 
            </a>
        </div>

        <div class="card-body">
            <p>${commentList[i].CommentContent}</p>
        </div>
        `;
        commentListHTML.appendChild(commentItem);
    }

    let cmtContainer = document.getElementById(
        `cmt_${jobDescriptionId}_container`
    );
    cmtContainer.innerHTML = "";
    cmtContainer.appendChild(commentListHTML);

    let cmtInput = document.createElement("div");
    cmtInput.setAttribute("class", "card");
    cmtInput.innerHTML = `
        <div class="card-header">
            <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a comment here" id="form_floating_${jobDescriptionId}" style="height: 100px"></textarea>
                <label for="floatingTextarea">Comment</label>
            </div>
        </div>
        
        <div class="card-footer">
            <button type="button" class="btn btn-primary" id="add_cmt_${jobDescriptionId}">Comment</button>
        </div>
    `;
    cmtContainer.appendChild(cmtInput);

    document
        .getElementById(`add_cmt_${jobDescriptionId}`)
        .addEventListener("click", () => {
            addComment(jobDescriptionId);
        });
}

async function addComment(jobDescriptionId) {
    let comment_msg = document.getElementById(
        `form_floating_${jobDescriptionId}`
    ).value;

    let comment = {
        CommentContent: comment_msg,
        PostUUID: jobDescriptionId,
    };

    fetch(`http://localhost:8010/proxy/interactions/comment`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(comment),
    })
        .then(function (response) {
            if (response.status != 200) {
                alert(
                    "Something went wrong, please try post your comment later"
                );
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            getCommentList(jobDescriptionId);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function applyForJob(postId) {
    fetch(`http://localhost:8010/proxy/post/${postId}/apply`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(function (response) {
            if (response.status != 200) {
                alert("Something went wrong, please try apply later");
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            alert("Applied successfully");
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function createJdContainer(jobDescriptionData) {
    let jdHTML = document.createElement("div");

    jdHTML.innerHTML = `
    <div class="card card gedf-card">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="data:image/png;base64,${
                            jobDescriptionData.PostOwnerAvatar
                        }" alt="">
                    </div>
                    <div class="ml-2">
                        <div class="h5 m-0"> 
                            &nbsp;
                            <a class="nav-item" href="/profile/?id=${
                                jobDescriptionData.PostOwner
                            }" style="text-decoration: none;color: inherit;">
                                ${jobDescriptionData.PostOwnerName} 
                            </a>
                        </div>
                        <div class="h7 text-muted"> &nbsp;${
                            jobDescriptionData.PostOrganization
                        } </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i> ${getTimeDescriptionFromSeconds(
                jobDescriptionData.PostTimestamp
            )}</div>
            <h5 class="card-title">${jobDescriptionData.PostTitle}</h5>

            <p class="card-text">
                ${jobDescriptionData.PostRichContent}
            </p>
        </div>

        <div class="card-footer">
            <button type="button" class="btn btn-light btn-sm" id="like_${
                jobDescriptionData.PostUUID
            }" data-bs-toggle="modal" data-bs-target="#likeListModal">
                <span id="like_num_${jobDescriptionData.PostUUID}"> 
                    View Likes
                </span>
            </button>
            <button type="button" class="btn btn-light" id="like_action_${
                jobDescriptionData.PostUUID
            }">
                <a class="card-link" style="text-decoration: none;">
                    <i class="fa fa-gittip"></i> <span id="like_name_${
                        jobDescriptionData.PostUUID
                    }">Like</span>
                </a>
            </button>
            
            <button type="button" class="btn btn-light" id="cmt_${
                jobDescriptionData.PostUUID
            }">
                <a class="card-link" style="text-decoration: none;">
                    <i class="fa fa-comment"></i> Comment
                </a>
            </button>

            <button type="button" class="btn btn-primary" id="apply_${
                jobDescriptionData.PostUUID
            }">
                Apply for job
            </button>
            <button type="button" class="btn btn-light btn-sm" id="like_${
                jobDescriptionData.PostUUID
            }" data-bs-toggle="modal" data-bs-target="#applicantListModal">
                <span id="apply_num_${jobDescriptionData.PostUUID}"> 
                    View applicants
                </span>
            </button>
        </div>
        <div id="cmt_${jobDescriptionData.PostUUID}_container"></div>
    </div>
    `;

    fetch(
        `http://localhost:8010/proxy/interactions/like?post_uuid=${jobDescriptionData.PostUUID}`,
        {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].LikeOwner == localStorage.getItem("userId")) {
                    console.log("You liked this post");
                    document.getElementById(
                        `like_name_${jobDescriptionData.PostUUID}`
                    ).innerHTML = `Unlike`;
                }
            }
        });

    document.getElementById("jdContainer").appendChild(jdHTML);

    document.getElementById(`like_${jobDescriptionData.PostUUID}`).onclick =
        async () => {
            likeList = await getLikeList(jobDescriptionData.PostUUID);
            createLikeListContainer(likeList);
        };

    document.getElementById(`cmt_${jobDescriptionData.PostUUID}`).onclick =
        () => {
            getCommentList(jobDescriptionData.PostUUID);
        };

    document.getElementById(
        `like_action_${jobDescriptionData.PostUUID}`
    ).onclick = () => {
        fetch(
            `http://localhost:8010/proxy/interactions/like?post_uuid=${jobDescriptionData.PostUUID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${localStorage.getItem(
                        "accessToken"
                    )}`,
                },
            }
        )
            .then(function (response) {
                if (response.status == 200) {
                    if (
                        document.getElementById(
                            `like_name_${jobDescriptionData.PostUUID}`
                        ).innerHTML == `Like`
                    ) {
                        document.getElementById(
                            `like_name_${jobDescriptionData.PostUUID}`
                        ).innerHTML = `Unlike`;
                    } else {
                        document.getElementById(
                            `like_name_${jobDescriptionData.PostUUID}`
                        ).innerHTML = `Like`;
                    }
                }
                return response.json();
            })
            .then(function (data) {
                console.log("like action done");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    document.getElementById(`apply_${jobDescriptionData.PostUUID}`).onclick =
        () => {
            applyForJob(jobDescriptionData.PostUUID);
        };
}

$(document).ready(async function () {
    fetch("http://localhost:8010/proxy/posts/all?offset=0&limit=10", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.length; i++) {
                createJdContainer(data[i]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});
