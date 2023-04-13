import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.comment){
        handleComment(e.target.dataset.comment)
    }
    else if(e.target.dataset.trash){
        handleTrash(e.target.dataset.trash)
    }
})

document.getElementById('changeMode').addEventListener('click', function(){
    
    document.body.classList.toggle("reverse")

})

function handleTrash(tweetId){

    // find the target tweet based on ID
    const targetObjTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    // Remove the tweet from array based on index
    let tweetIndex = tweetsData.indexOf(targetObjTweet)
    
    tweetsData.splice(tweetIndex, 1)

    render()
}

// Function that uses the tweetId to filter the correct obj and adds the comment to the obj
function handleComment(tweetId){

    // Filter the correct obj
    const targetObjTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    // Get the input value from text area
    const commentInput = document.getElementById(`comment-input-${tweetId}`).value
    console.log(commentInput)
    
    // Check if not empty and creates a new obj to add to replies
    if (commentInput){
        let newTweetObj = {}
        newTweetObj = {
        handle: `@ZenoDegenkamp`,
        profilePic: `images/zeno.jpeg`,
        tweetText: `${commentInput}`
        }
    
        targetObjTweet.replies.push(newTweetObj)

        render()
    }
}

 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.getElementById(`make-comment-${replyId}`).classList.toggle('hidden')
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@ZenoDegenkamp`,
            profilePic: `images/zeno.jpeg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        

        // Check if the user is owner of tweet and enables to discard tweet
        let tweetOwner = `hidden`
        if (tweet.handle === `@ZenoDegenkamp`){
            tweetOwner = ``
        }
        
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="${tweetOwner} tweet-detail">
                <i class="fa-solid fa-trash-can" data-trash="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden tweet" id="make-comment-${tweet.uuid}">
            <textarea 
            placeholder="What is your comment?"
            id="comment-input-${tweet.uuid}"
            ></textarea>
            <button data-comment="${tweet.uuid}"  comment-btn">Make the comment</button>
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>    
    </div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

