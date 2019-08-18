import { Button, InputNumber, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Item } from '../../types';
import { DetailsTable } from '../DetailsTable/DetailsTable';
import { Section } from '../Section/Section';
import { getImage } from '../../utils/getImage';

type Props = {
  id: string;
  items: Item[];
};
export const Details: React.FC<Props> = ({ id, items }) => {
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState(0);
  useEffect(() => {
    setItem(items.find((item) => item.id === id) || items[0]);
  }, [id, items]);
  useEffect(() => {
    if (item === undefined) return;
    // setBidAmount(item.price);
  }, [item]);

  if (item === undefined) return <>Not found</>;

  return (
    <Section>
      <Typography.Title level={1}>{item.id}</Typography.Title>
      <img src={getImage(item)} alt={''} />
      <DetailsTable item={item} />
      <br />
      <br />
      <InputNumber
        value={bidAmount}
        min={0}
        formatter={(value) => (value ? (+value / 100).toFixed(2) : '')}
        parser={(value) => (value ? parseFloat(value) * 100 : 0)}
        onChange={(value) => value && setBidAmount(value)}
      />{' '}
      <Button type="primary">Bid</Button>
    </Section>
  );
};