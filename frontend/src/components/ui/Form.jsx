import { useState } from "react"
import { Button, CustomInput, SelectInput, Checkbox } from "@ui"

export const Form = ({
    title,
    fields,
    submitText = "Envoyer",
    onSubmit,
    initialValues,
    resetOnSubmit = false
}) => {
    const initialState = fields.reduce((acc, field) => {
        if (field.type === "checkbox") {
            acc[field.name] = initialValues?.[field.name] ?? false
        } else {
            acc[field.name] = initialValues?.[field.name] || ""
        }
        return acc
    }, {})

    const [values, setValues] = useState(initialState)

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        const parsedValues = fields.reduce((acc, field) => {
            if (field.type === "number") {
                acc[field.name] = Number(values[field.name])
            } else {
                acc[field.name] = values[field.name]
            }
            return acc
        }, {})

        onSubmit(parsedValues)

        if (resetOnSubmit) {
            setValues(initialState)
        }
    }

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body gap-4">
                {title && <h2 className="card-title">{title}</h2>}
                {fields.map((field) => {
                    if (field.type === "select") {
                        return (
                            <SelectInput
                                key={field.name}
                                labelText={field.label}
                                inputName={field.name}
                                inputValue={values[field.name]}
                                options={field.options}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )
                    }

                    if (field.type === "checkbox") {
                        return (
                            <Checkbox
                                key={field.name}
                                legendText={field.legend}
                                labelText={field.label}
                                inputName={field.name}
                                checked={values[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                            />
                        )
                    }

                    if (field.type === "textarea") {
                        return (
                            <div key={field.name} className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="text-sm font-medium">
                                    {field.label}
                                </label>
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    className="textarea textarea-bordered w-full"
                                    value={values[field.name]}
                                    placeholder={field.placeholder}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    rows={4}
                                />
                            </div>
                        )
                    }

                    return (
                        <CustomInput
                            key={field.name}
                            labelText={field.label}
                            inputName={field.name}
                            inputType={field.type}
                            inputValue={values[field.name]}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    )
                })}
                <div className="card-actions justify-end mt-2">
                    <Button text={submitText} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    )
}
