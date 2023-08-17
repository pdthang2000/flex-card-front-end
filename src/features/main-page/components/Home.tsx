import {Col, Row} from "antd";
import {SearchBar} from "./SearchBar";
import FlashCard from "../../../components/FlashCard/FlashCard";
import {useSelector} from "react-redux";
import {selectCardList} from "../selector";
import {Card} from "../../../models/Card";

const Home = () => {
  const cardList = useSelector(selectCardList);

  const renderCardList = () => {
    const rows = [];
    const span = 5;
    const offset = 1;
    for (let i = 0; i < cardList.length; i += 4) {
      const row = <Row className={'mb-10'} key={i}>
        { cardList[i] ? <Col span={span}><FlashCard key={i} card={cardList[i] as Card} /></Col> : undefined }
        { cardList[i + 1] ? <Col span={span} offset={offset}><FlashCard key={i + 1} card={cardList[i + 1] as Card} /></Col> : undefined }
        { cardList[i + 2] ? <Col span={span} offset={offset}><FlashCard key={i + 2} card={cardList[i + 2] as Card} /></Col> : undefined }
        { cardList[i + 3] ? <Col span={span} offset={offset}><FlashCard key={i + 3} card={cardList[i + 3] as Card} /></Col> : undefined }
      </Row>
      rows.push(row);
    }
    return rows.map(row => row);
  }

  return (
    <div className={'p-10'}>
      <Row>
        <Col span={10}>
          <SearchBar />
        </Col>
        <Col span={4} offset={10}>
        </Col>
      </Row>
      <div className={'mt-10'}>
        {renderCardList()}
      </div>
    </div>
  )
}

export default Home;