import Select from "react-select";
import { useMemo, useState } from "react";
import { Form, FormLabel, Table, Modal } from "react-bootstrap";

import { frameSizes, frames } from "./constants";
import { calulatePrice, ceilToNearest } from "./helpers/frame";

// TODO: Add setting
const Frame = ({ id, name, imageUrl }) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24 }}
    >
      {name || id}
    </div>
  );
};

const options = frames.map((frame) => ({
  label: <Frame {...frame} />,
  value: frame.id,
  ...frame,
}));

function App() {
  const [formData, setFormData] = useState({
    frame: null,
    length: 12,
    breadth: 9,
    hasGlass: true,
    hasMount: false,
    hasCardboard: true,
  });
  const [selectedSize, setSelectedSize] = useState(frameSizes[0]);
  const [opened, setOpened] = useState(false);
  const [modalData, setModalData] = useState({});

  const getTotalPrice = (frameData, configuration = {}) => {
    const frame = frameData || formData.frame;

    if (!frame) {
      return;
    }

    return calulatePrice({
      lengthInInches: configuration.length || formData.length,
      breadthInInches: configuration.breadth || formData.breadth,
      frameRatePerFeet: frame.ratePerFeet,
      hasGlass: configuration.hasGlass || formData.hasGlass,
      hasMount: configuration.hasMount || formData.hasMount,
      hasCardboard: configuration.hasCardboard || formData.hasCardboard,
      frameWidthInMillis: frame.width,
    });
  };

  const onFormDataChange = (key, value) => {
    setFormData((prevValue) => ({ ...prevValue, [key]: value }));
  };

  const onSubmit = (event) => {
    event?.preventDefault?.();
  };

  const totalPrice = useMemo(getTotalPrice, [formData]);
  const isCustomSize = selectedSize.id === "custom";
  const modal = (
    <Modal show={opened} onHide={() => setOpened(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Frame: {modalData?.frame?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={modalData?.frame?.imageUrl} width="100%" />
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="wrapper">
      {modal}
      <Form
        onSubmit={onSubmit}
        style={{ border: "1px solid green", padding: 24, borderRadius: 8 }}
      >
        <Form.Group className="mb-3">
          <FormLabel htmlFor="frame">Select Frame</FormLabel>{" "}
          {formData?.frame?.imageUrl && (
            <span
              onClick={() => {
                setModalData({ frame: formData.frame });
                setOpened(true);
              }}
              className="text-danger cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              {" "}
              (Show Image)
            </span>
          )}
          <Select
            inputId="frame"
            options={options}
            value={formData.frame}
            onChange={(newValue) => onFormDataChange("frame", newValue)}
            required
          />
        </Form.Group>

        {formData?.frame?.id === "custom" && (
          <>
            <Form.Group className="mb-3" controlId="rate">
              <Form.Label>Frame Rate Per Feet</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Rate (per feet)"
                value={formData.frame.ratePerFeet}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    frame: {
                      ...prevData.frame,
                      ratePerFeet: Number(event.target.value),
                    },
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="width">
              <Form.Label>Frame Width in Millimeter</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Width (in mm)"
                value={formData.frame.width}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    frame: {
                      ...prevData.frame,
                      width: Number(event.target.value),
                    },
                  }))
                }
              />
            </Form.Group>
          </>
        )}

        <Form.Group className="mb-3" controlId="size">
          <div>
            <label>Frame Size</label>
          </div>
          {frameSizes.map((size) => (
            <Form.Check
              key={size.id}
              inline
              label={<span style={{ cursor: "pointer" }}>{size.name}</span>}
              name="size"
              type="radio"
              id={size.id}
              style={{ marginRight: 24 }}
              checked={selectedSize.id === size.id}
              onChange={() => {
                setSelectedSize(frameSizes.find((item) => item.id === size.id));
                setFormData((prevData) => ({
                  ...prevData,
                  length: size.length,
                  breadth: size.breadth,
                }));
              }}
            />
          ))}
        </Form.Group>

        <Form.Group className="mb-3" controlId="length">
          <Form.Label>Length</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Length (in inches)"
            value={!isCustomSize ? selectedSize.length : formData.length}
            disabled={!isCustomSize}
            onChange={(event) =>
              onFormDataChange("length", Number(event.target.value))
            }
          />
          <Form.Text className="text-muted">
            Length should be in inches.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="breadth">
          <Form.Label>Breadth</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter breadth (in inches)"
            value={!isCustomSize ? selectedSize.breadth : formData.breadth}
            disabled={!isCustomSize}
            onChange={(event) =>
              onFormDataChange("breadth", Number(event.target.value))
            }
          />
          <Form.Text className="text-muted">
            Breadth should be in inches.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="mount">
          <Form.Check
            type="checkbox"
            label="Include Mount?"
            checked={formData.hasMount}
            onChange={(event) =>
              onFormDataChange("hasMount", event.target.checked)
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="glass">
          <Form.Check
            type="checkbox"
            label="Include Glass?"
            checked={formData.hasGlass}
            onChange={(event) =>
              onFormDataChange("hasGlass", event.target.checked)
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="mdf">
          <Form.Check
            type="checkbox"
            label="Include Cardboard?"
            checked={formData.hasCardboard}
            onChange={(event) =>
              onFormDataChange("hasCardboard", event.target.checked)
            }
          />
        </Form.Group>
      </Form>

      {totalPrice ? (
        <>
          <div className="mt-3">
            Frame:{" "}
            <span className="text-primary">
              {formData?.frame?.name || formData?.frame?.id}
            </span>
          </div>
          <div style={{ fontSize: 24 }} className="mb-3">
            Total Cost:{" "}
            <span className="text-danger">
              Rs. {ceilToNearest(totalPrice, 25)}{" "}
              <span className="text-primary" style={{ fontSize: 14 }}>
                ({Math.ceil(totalPrice)})
              </span>
            </span>
          </div>

          <h2 className="mb-2">Cost of other frames</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Frame Name</th>
                <th>Cost Without Mount</th>
                <th>Cost With Mount</th>
              </tr>
            </thead>
            <tbody>
              {frames
                .filter((frame) => frame.id !== "custom")
                .map((frame, index) => (
                  <tr key={frame.id}>
                    <td>{index + 1}</td>
                    <td>
                      {frame.name}{" "}
                      {frame.imageUrl && (
                        <span
                          onClick={() => {
                            setModalData({ frame });
                            setOpened(true);
                          }}
                          className="text-danger cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          {" "}
                          (Show Image)
                        </span>
                      )}
                    </td>
                    <td>
                      Rs.{" "}
                      {ceilToNearest(
                        getTotalPrice(frame, { ...formData, hasMount: false }),
                        25
                      )}
                    </td>
                    <td>
                      Rs.{" "}
                      {ceilToNearest(
                        getTotalPrice(frame, { ...formData, hasMount: true }),
                        25
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      ) : null}
    </div>
  );
}

export default App;
