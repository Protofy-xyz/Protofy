import React from "react";
import { Image, Button } from "native-base";
import { optionsTranslations } from '../../utils/translations';
import { useRouter } from 'next/router';
import Head from 'next/head'

export type Props = {
  serviceSelected: string,
  onSelect: Function,
  services: string[]
};

export const MenuBar = ({ serviceSelected, onSelect, services }: Props) => {
  const margin = '20px'
  const height = '20px'

  const router = useRouter()
  const hostnameParts = window.location.hostname.split('.').reverse()
  const cloudSubDomain =  hostnameParts[2]

  return (
    <>
      <Head>
        <link rel="prefetch" href={`https://${cloudSubDomain}.protofy.xyz`} />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '5px', alignItems: 'center', backgroundColor: 'black' }}>
        <Image alt="protofy logo" onClick={() => router.push(`https://${cloudSubDomain}.protofy.xyz`)} alignSelf={'center'} resizeMode="contain" source={require("../../assets/logos/logo-white.png")} size="20px" marginLeft={margin} style={{ cursor: 'pointer' }} />
        {
          services.map((service, index) => <Button key={index} style={{ backgroundColor: serviceSelected == service ? '#252526' : 'transparent' }} onPress={() => onSelect(service)} h={height} marginLeft={margin}>{optionsTranslations[service]}</Button >)
        }
      </div>
    </>

  );
};
