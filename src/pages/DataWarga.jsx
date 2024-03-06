import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DataTablePrime from '../components/DataWarga/DataTablePrime';
import DefaultLayout from '../layout/DefaultLayout';

//import '../components/DataWarga/index.css';
//import '../components/DataWarga/flags.css';

// import 'primeicons/primeicons.css';
// //import 'primeflex/primeflex.css';  
// import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';

const Tables = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Warga" />

      <div className="flex flex-col gap-10" >
        <DataTablePrime />
      </div>
    </DefaultLayout>
  );
};

export default Tables;
