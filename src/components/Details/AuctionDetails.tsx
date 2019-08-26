import { Button, InputNumber, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { IAuctionDetails, bid, toHash } from '../../utils/api';
import { withKeeper } from '../../utils/tmpSimpleKeeper';
import { getImage } from '../../utils/getImage';
import { IPublicState } from '../../utils/keeper';
import { DetailsTable } from '../DetailsTable/DetailsTable';
import { Section } from '../Section/Section';

type Props = {
  auction?: IAuctionDetails;
  state?: IPublicState;
};
export const AuctionDetails: React.FC<Props> = ({ auction, state }) => {
  const [bidAmount, setBidAmount] = useState(0);

  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (auction) {
      getImage(auction).then((img) => {
        setImage(img);
      });
    }
  }, [auction]);

  const handleBid = () => {
    const fullHash = toHash(bidAmount);
    if (auction) {
      localStorage.setItem(auction.id, JSON.stringify(fullHash));
      withKeeper(async (api) => {
        const lotTx = await bid(
          {
            auctionId: auction.id,
            hash: fullHash.hashedAmount,
            priceAssetId: auction.priceAssetId,
            deposit: auction.deposit || 0,
          },
          api.signAndPublishTransaction
        );

        console.info('Created asset: ' + lotTx.id + ' waiting for tx');
      });
    }
  };

  if (auction === undefined) return <>Auction not found</>;

  return (
    <Section>
      <Typography.Title level={1}>{auction.id}</Typography.Title>
      <img src={image} alt={''} />
      <DetailsTable item={auction} />
      <br />
      <br />

      {state!.account!.address === auction.organizer ? (
        <>
          <Button type="primary">SETTLE</Button>
        </>
      ) : (
        <>
          <InputNumber
            value={bidAmount}
            min={0}
            formatter={(value) => (value ? (+value / 100).toFixed(2) : '')}
            parser={(value) => (value ? parseFloat(value) * 100 : 0)}
            onChange={(value) => value && setBidAmount(value)}
          />{' '}
          <Button type="primary" onClick={handleBid}>
            Bid
          </Button>
        </>
      )}
    </Section>
  );
};