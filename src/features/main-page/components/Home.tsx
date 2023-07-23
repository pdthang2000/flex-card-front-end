import {Col, Row} from "antd";
import {SearchBar} from "./SearchBar";
import FlashCard from "../../../components/FlashCard/FlashCard";

const Home = () => {
  return (
    <div className={'p-10'}>
      <Row>
        <Col span={10} className={'h-10 bg-black border-0 rounded-full my-auto'}>
          <SearchBar />
        </Col>
        <Col span={4} offset={10}>
        </Col>
      </Row>
      <div className={'mt-10'}>
        <Row>
          <Col span={5}>
            <FlashCard />
          </Col>
          <Col span={5} offset={1}>
            <FlashCard />
          </Col>
          <Col span={5} offset={1}>
            <FlashCard />
          </Col>
          <Col span={5} offset={1}>
            <FlashCard />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home;