// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract InvestionnaireDiploma is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    uint256 private _nextTokenId = 1;
    uint256 public printFeeWei;
    address public treasury;

    struct Diploma {
        string studentName;
        string courseName;
        string diplomaURI;
        uint256 issueDate;
        bool valid;
        uint256 printCount;
        uint256 lastPrintDate;
    }

    mapping(uint256 => Diploma) public diplomas;
    mapping(address => uint256) public diplomaOf;
    mapping(uint256 => string) private _tokenURIs;

    event DiplomaIssued(
        uint256 indexed tokenId,
        address indexed graduate,
        string studentName,
        string courseName
    );

    event DiplomaRevoked(uint256 indexed tokenId);
    event PrintFeeUpdated(uint256 newFeeWei);
    event TreasuryUpdated(address newTreasury);

    event DiplomaPrintPaid(
        uint256 indexed tokenId,
        address indexed graduate,
        uint256 amount,
        uint256 timestamp
    );

    constructor(address admin, address treasury_, uint256 initialPrintFeeWei)
        ERC721("Investionnaire Diploma", "INVDIP")
    {
        require(admin != address(0), "Invalid admin");
        require(treasury_ != address(0), "Invalid treasury");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);

        treasury = treasury_;
        printFeeWei = initialPrintFeeWei;
    }

    function issueDiploma(
        address graduate,
        string memory studentName,
        string memory courseName,
        string memory diplomaURI
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(graduate != address(0), "Invalid graduate");
        require(diplomaOf[graduate] == 0, "Diploma already exists");

        uint256 tokenId = _nextTokenId++;
        _safeMint(graduate, tokenId);

        diplomas[tokenId] = Diploma({
            studentName: studentName,
            courseName: courseName,
            diplomaURI: diplomaURI,
            issueDate: block.timestamp,
            valid: true,
            printCount: 0,
            lastPrintDate: 0
        });

        diplomaOf[graduate] = tokenId;
        _tokenURIs[tokenId] = diplomaURI;

        emit DiplomaIssued(tokenId, graduate, studentName, courseName);
        return tokenId;
    }

    function revokeDiploma(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_exists(tokenId), "Diploma does not exist");
        diplomas[tokenId].valid = false;
        emit DiplomaRevoked(tokenId);
    }

    function payToPrint(uint256 tokenId) external payable nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not diploma owner");
        require(diplomas[tokenId].valid, "Diploma not valid");
        require(msg.value >= printFeeWei, "Insufficient print fee");

        diplomas[tokenId].printCount += 1;
        diplomas[tokenId].lastPrintDate = block.timestamp;

        (bool sent, ) = payable(treasury).call{value: msg.value}("");
        require(sent, "Transfer failed");

        emit DiplomaPrintPaid(tokenId, msg.sender, msg.value, block.timestamp);
    }

    function setPrintFee(uint256 newFeeWei)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        printFeeWei = newFeeWei;
        emit PrintFeeUpdated(newFeeWei);
    }

    function setTreasury(address newTreasury)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function verifyDiploma(uint256 tokenId)
        external
        view
        returns (
            bool exists,
            bool valid,
            string memory studentName,
            string memory courseName,
            uint256 issueDate,
            address graduate,
            uint256 printCount,
            uint256 lastPrintDate
        )
    {
        if (!_exists(tokenId)) {
            return (false, false, "", "", 0, address(0), 0, 0);
        }

        Diploma memory d = diplomas[tokenId];
        return (
            true,
            d.valid,
            d.studentName,
            d.courseName,
            d.issueDate,
            ownerOf(tokenId),
            d.printCount,
            d.lastPrintDate
        );
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        if (from != address(0) && to != address(0)) {
            revert("Non-transferable diploma");
        }
    }
}
