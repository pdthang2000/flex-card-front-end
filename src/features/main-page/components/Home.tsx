import {Col, Row} from "antd";
import {SearchBar} from "./SearchBar";
import FlashCard from "../../../components/FlashCard/FlashCard";
import {useSelector} from "react-redux";
import {selectCardList} from "../selector";

const Home = () => {
  const cardList = useSelector(selectCardList);

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
        <Row>
          {
            cardList.map((card, index) => {
              if (!card) return undefined;

              return <Col span={5} offset={index % 4 === 0 ? 0 : 1} className={'pt-10'}>
                      <FlashCard card={card}/>
                    </Col>
            })
          }
        </Row>
      </div>
    </div>
  )
}

export default Home;