# 1
chmod -R 0755 ./crypto-config
rm -rf ./crypto-config
rm genesis.block mychannel.tx
# rm -rf ../../channel-artifacts/*

cryptogen generate --config=./crypto-config.yaml --output=./crypto-config/

# 2
SYS_CHANNEL="sys-channel"
CHANNEL_NAME="mychannel"

echo $CHANNEL_NAME

configtxgen -profile OrdererGenesis -configPath . -channelID $SYS_CHANNEL  -outputBlock ./config/genesis.block
configtxgen -profile BasicChannel -configPath . -outputCreateChannelTx ./config/mychannel.tx -channelID $CHANNEL_NAME

# 3
configtxgen -profile BasicChannel -outputAnchorPeersUpdate ./config/SupplierMSPanchors.tx -channelID $CHANNEL_NAME -asOrg SupplierMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for SupplierMSP..."
  exit 1
fi


configtxgen -profile BasicChannel -outputAnchorPeersUpdate ./config/ManufacturerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ManufacturerMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for ManufacturerMSP..."
  exit 1
fi


configtxgen -profile BasicChannel -outputAnchorPeersUpdate ./config/CarrierMSPanchors.tx -channelID $CHANNEL_NAME -asOrg CarrierMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for CarrierMSP..."
  exit 1
fi


configtxgen -profile BasicChannel -outputAnchorPeersUpdate ./config/RetailerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg RetailerMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for RetailerMSP..."
  exit 1
fi


configtxgen -profile BasicChannel -outputAnchorPeersUpdate ./config/CustomerMSPanchors.tx -channelID $CHANNEL_NAME -asOrg CustomerMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for CustomerMSP..."
  exit 1
fi

