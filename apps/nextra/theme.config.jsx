
import Image from 'next/image'


export default {
  logo: <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ marginRight: '10px' }}>
      <img src="/logo.png" alt="Protofy" width="40" height="40" />
    </span>
    <span style={{ fontWeight: 'bold', fontSize: '18px', opacity:0.8}}>Protofy</span>
  </div>,
  project: {
    link: 'https://github.com/Protofy-xyz/Protofy'
  },
  docsRepositoryBase: 'https://github.com/Protofy-xyz/Protofy/tree/main/apps/nextra',
  footer: false
  // ... other theme options
}