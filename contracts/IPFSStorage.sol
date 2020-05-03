pragma solidity >=0.4.22 <0.7.0;


contract IPFSStorage {
    string hash;

    function storeCIDAsString(string memory _hash) public {
        hash = _hash;
    }

    //////////////////////////////

    struct Multihash {
        bytes2 hash_function;
        uint8 size;
        bytes32 hash;
    }

    Multihash multihash;

    function storeCIDAsStruct(bytes2 _hash_function, uint8 _size, bytes32 _hash)
        public
    {
        multihash = Multihash(_hash_function, _size, _hash);
    }

    //////////////////////////////

    event CIDStoredInTheLog(string _hash);

    function storeCIDInTheLog(string memory _hash) public {
        emit CIDStoredInTheLog(_hash);
    }

    //////////////////////////////

    event CIDStructStoredInTheLog(
        bytes1 hash_function,
        bytes1 size,
        bytes32 hash
    );

    function storeCIDStructInTheLog(
        bytes1 _hash_function,
        bytes1 _size,
        bytes32 _hash
    ) public {
        emit CIDStructStoredInTheLog(_hash_function, _size, _hash);
    }
}
