//SPDX-License-Identifier: MIT
// Two pages to app: Home and Profile
// Must have NFT to post content
// NFT will represent avatar. Store username and image as NFT metadata
// For profile page, if user has not created an NFT yet then a form will appear that allows users to mint their own NFT profile.
// For profile page, if user has created an NFT then it will display the users profile picture and username at the top of the page
// and below that there will be a form at the bottom that allows users to create a new NFT for their profile.

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Decentratwitter is ERC721URIStorage {
    mapping(uint256 => uint256) commentCount;
    struct comment {
        string commentContent;
        address commentAuthor;
    }
    mapping(uint256 => comment[]) comments;

    function viewCount(uint256 _postId) public view returns (uint256) {
        return commentCount[_postId];
    }

    function postComment(
        uint256 _postId,
        string calldata _commentContent,
        address _commentAuthor
    ) public {
        comment memory thisComment;
        thisComment.commentContent = _commentContent;
        thisComment.commentAuthor = _commentAuthor;
        comments[_postId].push(thisComment);
        commentCount[_postId] = commentCount[_postId] + 1;
    }

    function viewComment(
        uint256 _postId,
        uint256 _commentNumber
    ) public view returns (comment memory) {
        comment[] memory commentSet = comments[_postId];
        return commentSet[_commentNumber];
    }

    uint256 public tokenCount;
    uint256 public postCount;
    uint256 public reportCount;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Report) public reports;

    // address --> nft id
    mapping(address => uint256) public profiles;

    struct Post {
        uint256 id;
        string hash;
        uint256 tipAmount;
        address payable author;
    }
    struct Report {
        uint256 id;
        string hash;
        uint256 tipAmount;
        address payable author;
    }
    event ReportCreated(
        uint256 id,
        string hash,
        uint256 tipAmount,
        address payable author
    );
    event PostCreated(
        uint256 id,
        string hash,
        uint256 tipAmount,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string hash,
        uint256 tipAmount,
        address payable author
    );

    constructor() ERC721("Decentratwitter", "DAPP") {}

    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        setProfile(tokenCount);
        return (tokenCount);
    }

    function setProfile(uint256 _id) public {
        require(
            ownerOf(_id) == msg.sender,
            "Must own the nft you want to select as your profile"
        );
        profiles[msg.sender] = _id;
    }

    function uploadPost(string memory _postHash) external {
        // Check that the user owns an nft
        require(
            balanceOf(msg.sender) > 0,
            "Must own a decentratwitter nft to post"
        );
        // Make sure the post hash exists
        require(bytes(_postHash).length > 0, "Cannot pass an empty hash");
        // Increment post count
        postCount++;
        // Add post to the contract
        posts[postCount] = Post(postCount, _postHash, 0, payable(msg.sender));
        // Trigger an event
        emit PostCreated(postCount, _postHash, 0, payable(msg.sender));
    }

    function uploadReport(string memory _reportHash) external {
        // Check that the user owns an nft
        require(
            balanceOf(msg.sender) > 0,
            "Must own a decentratwitter nft to post"
        );
        // Make sure the post hash exists
        require(bytes(_reportHash).length > 0, "Cannot pass an empty hash");
        // Increment post count
        reportCount++;
        // Add post to the contract
        reports[reportCount] = Report(
            reportCount,
            _reportHash,
            0,
            payable(msg.sender)
        );
        // Trigger an event
        emit ReportCreated(reportCount, _reportHash, 0, payable(msg.sender));
    }

    function tipPostOwner(uint256 _id) external payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount, "Invalid post id");
        // Fetch the post
        Post memory _post = posts[_id];
        require(_post.author != msg.sender, "Cannot tip your own post");
        // Pay the author by sending them Ether
        _post.author.transfer(msg.value);
        // Increment the tip amount
        _post.tipAmount += msg.value;
        // Update the image
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(_id, _post.hash, _post.tipAmount, _post.author);
    }

    // Fetches all the posts
    function getAllPosts() external view returns (Post[] memory _posts) {
        _posts = new Post[](postCount);
        for (uint256 i = 0; i < _posts.length; i++) {
            _posts[i] = posts[i + 1];
        }
    }

    function getAllReports() external view returns (Report[] memory _reports) {
        _reports = new Report[](reportCount);
        for (uint256 i = 0; i < _reports.length; i++) {
            _reports[i] = reports[i + 1];
        }
    }

    // Fetches all of the users nfts
    function getMyNfts() external view returns (uint256[] memory _ids) {
        _ids = new uint256[](balanceOf(msg.sender));
        uint256 currentIndex;
        uint256 _tokenCount = tokenCount;
        for (uint256 i = 0; i < _tokenCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                _ids[currentIndex] = i + 1;
                currentIndex++;
            }
        }
    }
}
