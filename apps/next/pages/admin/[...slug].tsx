import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  
  const targetPath = `/workspace/${Array.isArray(slug) ? slug.join('/') : slug}`;

  return {
    redirect: {
      destination: targetPath,
      permanent: false, 
    },
  };
};

const AdminCatchAll = () => null;

export default AdminCatchAll;