package main

import (
	"fmt"

	"github.com/mpdn99/supply-chain-hyperledger/host1/application/web"
)

const (
	CryptoPath = "/Users/rifkhanmohamed/Documents/blockchain/Project_V1/artifacts/channel/crypto-config/peerOrganizations/supplier.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		OrgName:      "Supplier",
		MSPID:        "SupplierMSP",
		CertPath:     CryptoPath + "/users/User1@supplier.example.com/msp/signcerts/User1@supplier.example.com-cert.pem",
		KeyPath:      CryptoPath + "/users/User1@supplier.example.com/msp/keystore/",
		TLSCertPath:  CryptoPath + "/peers/peer0.supplier.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:7051",
		GatewayPeer:  "peer0.supplier.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
