export const version = "23.7.R1"

export const versions = [
  "23.7.R1",
  "23.3.R3",
  "23.3.R2",
  "23.3.R1",
  "22.10.R4",
  "22.10.R3",
  "22.10.R2",
]

export const areas = [
  { label: "config", value: "/config", help: "Nokia YANG config model" },
  {
    label: "groups",
    value: "/configure/groups",
    help: "Config groups from the YANG model",
  },
  {
    label: "OpenConfig",
    value: "configure openconfig",
    help: "OpenConfig config & state elements from the MD-CLI",
  },
  { label: "state", value: "/state", help: "YANG state model" },
  { label: "tools", value: "tools", help: "MD-CLI tools commands" },
  { label: "show", value: "show", help: "MD-CLI show commands" },
  //{ label: "debug", value: "debug", help: "MD-CLI debug commands" },
  { label: "other", value: "other", help: "Other MD-CLI commands" },
]
