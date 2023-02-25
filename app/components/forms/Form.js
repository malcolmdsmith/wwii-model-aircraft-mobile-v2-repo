import React from "react";
import { Formik } from "formik";
import Button from "../Button";

const searchData = {
  aircraft_name: "",
  year_of_manufacture: 0,
  country_of_manufacturer: "",
  manufacturer_id: 0,
  primary_group_id: 0,
  media_id: 0,
  scale_id: 0,
};

function AppForm({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  resetValues,
  onHandleReset,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {(props) => (
        <>
          {children}
          <Button
            title="Clear"
            onPress={() => {
              props.resetForm({ values: resetValues });
              onHandleReset();
            }}
          ></Button>
        </>
      )}
    </Formik>
  );
}

export default AppForm;
