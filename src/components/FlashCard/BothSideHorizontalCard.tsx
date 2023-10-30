import { Col, Divider, Row } from 'antd';
import { Card } from '../../models/Card';
import CardUtilButtons from './CardUtilButtons';
import React from 'react';

interface CardInputProps {
  card: Card;
}

const BothSideHorizontalCard = ({ card }: CardInputProps) => {
  return (
    <Row>
      <Col span={23}>
        <div className={'w-full h-fit rounded-md bg-sub-main my-5'}>
          <Row className={'pt-8 text-white'}>
            <Col span={23} offset={0}>
              <CardUtilButtons card={card} />
            </Col>
          </Row>
          <Row className={'py-8 pl-8'}>
            <Col span={11}>
              <div
                className={
                  'text-white text-xl w-full p-0 break-words whitespace-pre-wrap'
                }
              >
                {card.front}
              </div>
              <div className={'w-full pt-2'}>
                <Divider className={`m-0 bg-white h-0.5`} />
                <p className={'text-xs pt-1 text-slate-400'}>FRONT</p>
              </div>
            </Col>
            <Col span={11} offset={1}>
              <div
                className={
                  'text-white text-xl w-full p-0 break-words whitespace-pre-wrap'
                }
              >
                {card.back}
              </div>
              <div className={'w-full pt-2'}>
                <Divider className={`m-0 bg-white h-0.5`} />
                <p className={'text-xs pt-1 text-slate-400'}>BACK</p>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default BothSideHorizontalCard;
