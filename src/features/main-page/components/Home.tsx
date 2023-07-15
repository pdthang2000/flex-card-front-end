import {Col, Row} from "antd";
import {SearchBar} from "./SearchBar";
import FlashCard from "../../FlashCard";


const Home = () => {
  return (
    <div className={'p-10'}>
      <Row>
        <Col span={10} className={'h-10 bg-black border-0 rounded-full my-auto'}>
          <SearchBar />
        </Col>
      </Row>
      <div className={'mt-10 bg-gray-600'}>
        <Row>
          <Col span={4}>
            <FlashCard />
          </Col>
          <Col span={4} offset={1}>
            <FlashCard />
          </Col>
          <Col span={4} offset={1}>
            <FlashCard />
          </Col>
          <Col span={4} offset={1}>
            <FlashCard />
          </Col>
          <Col span={4} offset={1}>
            <FlashCard />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home;