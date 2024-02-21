import React, { useEffect, useState } from 'react';
import { Layout, Input, Timeline } from 'antd';
import "./index.css"
import PageHeader from '../../components/PageHeader';
import { Html5QrcodeScanType, Html5QrcodeScanner} from "html5-qrcode";

const { Content, Footer } = Layout;
const { Search } = Input;

interface productResponseItemProps {
  ProductId: string,
  Name: string,
  Supplier: string,
  Manufacturer: string,
  Distributor: string,
  Retailer: string,
  Consumer: string,
  Status: string,
  Position: positionItemProps[],
  Price: number
}

interface positionItemProps {
  Date: string
  Organization: string
  Longtitude: number
  Latitude: number
}

const Home: React.FC = () => {
  const [productResponse, setProductResponse] = useState<productResponseItemProps | null>();
  const [err, setErr] = useState('');
  const [item, setItem] = useState<any>([]);
  const [scanResult, setScanResult] = useState(null);

  const queryProduct = (productId: string) => {
    setProductResponse(null)
    fetch(`http://localhost:3004/query?channelid=mychannel&chaincodeid=supplychain&function=queryProduct&args=${productId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(respose => respose.json())
      .then(data => {
        setProductResponse(data)
        checkItem(data)
      })
      .catch(() => setErr(productId))
  }

  const getUniqueListBy = (arr: any, key: any) => {
    return [...new Map(arr.map((item: any) => [item[key], item])).values()]
  }

  const checkItem = (data: any) => {
    if (data.Position[0]?.Date) {
      setItem((prev: any) => getUniqueListBy([...(prev || []), {
        color: 'green',
        label: data.Position[0]?.Date,
        children: `Product was supplied at ${data.Position[0]?.Organization}`
      }], "color"))
    }
    if (data.Position[1]?.Date) {
      setItem((prev: any) => getUniqueListBy([...(prev || []), {
        color: 'red',
        label: data.Position[1]?.Date,
        children: `Product was manufactured at ${data.Position[1]?.Organization}`
      }], "color"))
    }
    if (data.Position[2]?.Date) {
      setItem((prev: any) => getUniqueListBy([...(prev || []), {
        color: 'yellow',
        label: data.Position[2]?.Date,
        children: `Product was transfered to ${data.Position[2]?.Organization}`
      }], "color"))
    }
    if (data.Position[3]?.Date) {
      setItem((prev: any) => getUniqueListBy([...(prev || []), {
        color: 'blue',
        label: data.Position[3]?.Date,
        children: `Product was delivered to ${data.Position[3]?.Organization}`
      }], "color"))
    }
    if (data.Position[4]?.Date) {
      setItem((prev: any) => getUniqueListBy([...(prev || []), {
        color: 'gray',
        label: data.Position[4]?.Date,
        children: `Product was sold at ${data.Position[3]?.Organization}`
      }], "color"))
    }
  }

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 500, height: 500 },
      rememberLastUsedCamera: true,
      // Only support camera scan type.
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    const scanner = new Html5QrcodeScanner("reader", config, /* verbose= */ true);

    // Explicitly check if the element with id "reader" exists
    const containerElement = document.getElementById("reader");

    if (containerElement) {
      // Now check if video elements exist inside the container
      const videoElements = containerElement.getElementsByTagName("video");

      if (videoElements.length > 0) {
        const videoElement = videoElements[0];

        // Apply styles to the video element
        videoElement.style.cssText = "height: 500px;";// Adjust the height as needed
      } else {
        console.error("No video elements found inside the container");
      }
    } else {
      console.error("Container element with id 'reader' not found");
    }

    scanner.render(success, error);

    function success(result: any) {
      scanner.clear();
      setScanResult(result);
      // Trigger the search with the scanned result
      if (result) {
        queryProduct(result);
      }
    }

    function error(err: any) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);


  return (
    <Layout className="layout">
      <PageHeader />
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <h1>Product tracking</h1>
        <Search placeholder="Product Code" enterButton="Search" size="large" onSearch={queryProduct}></Search>
         <div id='reader'></div>
        {productResponse ?
          (
            <>
              <p>
                <span className='productTxt'>
                  Product name:
                </span>
                <span>
                  {productResponse.Name}
                </span>
              </p><p>
                <span className='productTxt'>
                  Manufacturer:
                </span>
                <span>
                  {productResponse.Manufacturer}
                </span>
              </p><p>
                <span className='productTxt'>
                  Status:
                </span>
                <span>
                  {productResponse.Status}
                </span>
              </p><p>
                <span className='productTxt'>Tracking Proceess:</span>
              </p><Timeline style={{ margin: '20px 30px 20px 30px' }} items={item} mode="left">
              </Timeline>
            </>
          ) :
          (
            err ? <p style={{ color: 'red' }}>{err} not found!</p> : null
          )
        }
      </Content>
      <Footer style={{ textAlign: 'center' }}>SupplyChain ©2024 Created by Rifkhan</Footer>
    </Layout>
  );
};

export default Home;