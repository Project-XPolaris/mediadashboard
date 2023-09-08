import {Button, Divider, Drawer, Space, Tabs, Upload} from "antd";
import {
  ProForm, ProFormCheckbox,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormInstance,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-components";
import {UploadOutlined} from "@ant-design/icons";
import {useRef} from "react";

export type LoraTrainConfig = {
  name?: string
  preprocess_config: PreprocessConfig;
  step: number;
  train_param: TrainConfigValues
}
// {
//   "process_width":512,
//   "process_height":512,
//   "id_task":"some_id",
//   "preprocess_txt_action":"copy",
//   "process_flip":false,
//   "process_split":false,
//   "process_caption":false,
//   "process_caption_deepbooru":true
// }
export type PreprocessConfig = {
  process_width: number;
  process_height: number;
  id_task: string;
  preprocess_txt_action: string;
  process_flip: boolean;
  process_split: boolean;
  process_caption: boolean;
  process_caption_deepbooru: boolean;
  process_focal_crop: boolean;
  process_multicrop: boolean;
  process_split_threshold: number;
  process_overlap_ratio: number;
  process_focal_crop_face_weight: number,
  process_focal_crop_entropy_weight: number,
  process_focal_crop_edges_weight: number,
  process_focal_crop_debug: boolean
  process_multicrop_mindim: number;
  process_multicrop_maxdim: number;
  process_multicrop_minarea: number;
  process_multicrop_maxarea: number;
  process_multicrop_objective: string;
  process_multicrop_threshold: number;

}
export type TrainConfigValues = {
  name?: string
  pretrained_model_name_or_path: string;
  v2: boolean;
  v_parameterization: boolean;
  train_data_dir: string;
  output_dir: string;
  resolution: string;
  learning_rate: number;
  lr_scheduler: string;
  lr_warmup_steps: number;
  train_batch_size: number;
  epoch: string;
  save_every_n_epochs: number;
  mixed_precision: string;
  save_precision: string;
  seed: number;
  num_cpu_threads_per_process: number;
  cache_latents: boolean;
  caption_extension: string;
  enable_bucket: boolean;
  gradient_checkpointing: boolean;
  full_fp16: boolean;
  no_token_padding: boolean;
  stop_text_encoder_training_pct: number;
  xformers: boolean;
  save_model_as: string;
  shuffle_caption: boolean;
  resume: string;
  prior_loss_weight: number;
  text_encoder_lr: number;
  unet_lr: number;
  network_dim: number;
  network_weights: string;
  color_aug: boolean;
  flip_aug: boolean;
  clip_skip: number;
  gradient_accumulation_steps: number;
  mem_eff_attn: boolean;
  output_name: string;
  model_list: string;
  max_token_length: number;
  max_train_epochs: number;
  max_data_loader_n_workers: number;
  network_alpha: number;
  training_comment: string;
  keep_tokens: number;
  lr_scheduler_num_cycles: number;
  lr_scheduler_power: number;
  persistent_data_loader_workers: boolean;
  bucket_no_upscale: boolean;
  random_crop: boolean;
  bucket_reso_steps: number;
  caption_dropout_every_n_epochs: number;
  caption_tag_dropout_rate: number;
  optimizer: string;
  optimizer_args: string;
  noise_offset: string;
  LoRA_type: string;
  conv_dim: number;
  conv_alpha: number;
  sample_every_n_steps: number;
  sample_every_n_epochs: number;
  sample_sampler: string;
  sample_prompts: string;
  additional_parameters: string;
  vae_batch_size: number;
}
const initValues: LoraTrainConfig = {
  train_param: {
    pretrained_model_name_or_path: "runwayml/stable-diffusion-v1-5",
    save_model_as: "safetensors",
    v2: false,
    v_parameterization: false,
    LoRA_type: "Standard",
    train_batch_size: 2,
    epoch: "1",
    save_every_n_epochs: 0,
    caption_extension: ".txt",
    mixed_precision: "fp16",
    save_precision: "fp16",
    num_cpu_threads_per_process: 2,
    cache_latents: true,
    seed: 1234,
    learning_rate: 0.0001,
    lr_scheduler: "constant",
    lr_warmup_steps: 0,
    optimizer: "AdamW8bit",
    text_encoder_lr: 0.00005,
    unet_lr: 0.0001,
    network_dim: 128,
    network_alpha: 128,
    resolution: "512,512",
    stop_text_encoder_training_pct: 0,
    enable_bucket: false,
    no_token_padding: false,
    gradient_accumulation_steps: 1,
    prior_loss_weight: 1.0,
    lr_scheduler_num_cycles: 1,
    keep_tokens: 0,
    clip_skip: 1,
    max_token_length: 75,
    full_fp16: false,
    gradient_checkpointing: false,
    shuffle_caption: false,
    persistent_data_loader_workers: false,
    mem_eff_attn: false,
    xformers: true,
    color_aug: false,
    flip_aug: false,
    bucket_no_upscale: true,
    bucket_reso_steps: 64,
    random_crop: false,
    noise_offset: "",
    caption_dropout_every_n_epochs: 0,
    caption_tag_dropout_rate: 0,
    vae_batch_size: 1,
    resume: "",
    max_train_epochs: 0,
    max_data_loader_n_workers: 8,
    output_name: "",
    sample_every_n_steps: 0,
    sample_every_n_epochs: 0,
    sample_sampler: 'euler_a',
    sample_prompts: "",
    training_comment: "",
    lr_scheduler_power: 1,
    optimizer_args: "",
    conv_dim: 1,
    conv_alpha: 1,
    additional_parameters: "",
    network_weights: ""
  },

  step: 100,
  preprocess_config: {
    id_task: "",
    process_width: 512,
    process_height: 512,
    process_split: false,
    preprocess_txt_action: "ignore",
    process_focal_crop: false,
    process_multicrop: false,
    process_caption: false,
    process_caption_deepbooru: false,
    process_flip: false,
    process_split_threshold: 0.5,
    process_overlap_ratio: 0.2,
    process_focal_crop_face_weight: 0.9,
    process_focal_crop_entropy_weight: 0.15,
    process_focal_crop_edges_weight: 0.5,
    process_focal_crop_debug: false,
    process_multicrop_mindim: 384,
    process_multicrop_maxdim: 768,
    process_multicrop_minarea: 64 * 64,
    process_multicrop_maxarea: 640 * 640,
    process_multicrop_objective: "Maximize area",
    process_multicrop_threshold: 0.1,
  }
}

export type LoraConfigDrawerProps = {
  open?: boolean
  onClose?: () => void,
  onOk?: (values: LoraTrainConfig) => void
}
const LoraConfigDrawer = (
  {
    open,
    onClose,
    onOk
  }: LoraConfigDrawerProps) => {
  const formRef = useRef<ProFormInstance<LoraTrainConfig>>();
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={"Train config editor"}
      width={"50vw"}
      footer={
        <div style={{padding: 16}}>
          <Space>

            <Button type={"primary"} onClick={() => {
              if (!formRef.current) {
                return
              }
              formRef.current.submit()
            }}>Submit</Button>
            <Button
              onClick={() => {
                if (!formRef.current) {
                  return
                }
                formRef.current.resetFields()
              }}
            >Reset</Button>
            <Divider type={"vertical"}/>
            <Upload
              beforeUpload={file => {
                const reader = new FileReader();

                reader.onload = e => {
                  if (!e.target) {
                    return
                  }
                  if (formRef.current) {
                    formRef.current.submit();
                    formRef.current.setFieldsValue({train_param: JSON.parse(e.target.result as string)})
                  }
                };
                reader.readAsText(file);

                // Prevent upload
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined/>}>Upload Config from External</Button>

            </Upload>
          </Space>
        </div>
      }
    >
      <ProForm<LoraTrainConfig>
        initialValues={initValues}
        onFinish={async (values) => {
          onOk && onOk(values)
        }}
        submitter={false}
        formRef={formRef}
      >
        <ProFormText name={"name"} label={"Name"} placeholder={"config name"} required/>
        <Tabs
          items={[
            {
              label: "Preprocess",
              key: "preprocess",
              children: (
                <>
                  <ProFormGroup>
                    <ProFormSlider
                      label="Width"
                      name={["preprocess_config", "process_width"]}
                      min={64}
                      max={2048}
                      step={8}
                    />

                    <ProFormSlider
                      label="Height"
                      name={["preprocess_config", "process_height"]}
                      min={64}
                      max={2048}
                      step={8}
                    />

                    <ProFormSelect
                      label="Existing Caption txt Action"
                      name={["preprocess_config", "preprocess_txt_action"]}
                      options={[
                        {label: 'Ignore', value: 'ignore'},
                        {label: 'Copy', value: 'copy'},
                        {label: 'Prepend', value: 'prepend'},
                        {label: 'Append', value: 'append'},
                      ]}
                    />
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormCheckbox
                      label='Create flipped copies'
                      name={["preprocess_config", "process_flip"]}
                    />
                    <ProFormCheckbox
                      label='Split oversized images'
                      name={["preprocess_config", "process_split"]}
                    />
                    <ProFormCheckbox
                      label='Auto focal point crop'
                      name={["preprocess_config", "process_focal_crop"]}
                    />
                    <ProFormCheckbox
                      label='Auto-sized crop'
                      name={["preprocess_config", "process_multicrop"]}
                    />
                    <ProFormCheckbox
                      label='Use BLIP for caption'
                      name={["preprocess_config", "process_caption"]}
                    />
                    <ProFormCheckbox
                      label='Use deepbooru for caption'
                      name={["preprocess_config", "process_caption_deepbooru"]}
                    />
                  </ProFormGroup>
                  <ProFormDependency name={[["preprocess_config", "process_split"]]}>
                    {({preprocess_config}) => {
                      return (
                        preprocess_config.process_split &&
                        <ProFormGroup title={"Split options"}>
                          <ProFormSlider
                            label='Split image threshold'
                            name={["preprocess_config", "process_split_threshold"]}
                            min={0.0}
                            max={1.0}
                            step={0.05}
                          />
                          <ProFormSlider
                            label='Split image overlap ratio'
                            name={["preprocess_config", "process_overlap_ratio"]}
                            min={0.0}
                            max={0.9}
                            step={0.05}
                          />
                        </ProFormGroup>
                      );
                    }}
                  </ProFormDependency>
                  <ProFormDependency name={[["preprocess_config", "process_focal_crop"]]}>
                    {({preprocess_config}) => {
                      return (
                        preprocess_config.process_focal_crop &&
                        <ProFormGroup title={"Focal Crop"}>
                          <ProFormSlider
                            label='Focal point face weight'
                            name={["preprocess_config", "process_focal_crop_face_weight"]}
                            min={0.0}
                            max={1.0}
                            step={0.05}
                          />
                          <ProFormSlider
                            label='Focal point entropy weight'
                            name={["preprocess_config", "process_focal_crop_entropy_weight"]}
                            min={0.0}
                            max={1.0}
                            step={0.05}
                          />
                          <ProFormSlider
                            label='Focal point edges weight'
                            name={["preprocess_config", "process_focal_crop_edges_weight"]}
                            min={0.0}
                            max={1.0}
                            step={0.05}
                          />
                          <ProFormCheckbox
                            label='Create debug image'
                            name={["preprocess_config", "process_focal_crop_debug"]}
                          />
                        </ProFormGroup>
                      );
                    }}
                  </ProFormDependency>
                  <ProFormDependency name={[["preprocess_config", "process_multicrop"]]}>
                    {({preprocess_config}) => {
                      return (
                        preprocess_config.process_multicrop &&
                        <ProFormGroup title={"Multicrop"}>
                          <ProFormSlider
                            label="Dimension lower bound"
                            name={["preprocess_config", "process_multicrop_mindim"]}
                            min={64}
                            max={2048}
                            step={8}
                          />

                          <ProFormSlider
                            label="Dimension upper bound"
                            name={["preprocess_config", "process_multicrop_maxdim"]}
                            min={64}
                            max={2048}
                            step={8}
                          />

                          <ProFormSlider
                            label="Area lower bound"
                            name={["preprocess_config", "process_multicrop_minarea"]}
                            min={64 * 64}
                            max={2048 * 2048}
                            step={1}
                          />

                          <ProFormSlider
                            label="Area upper bound"
                            name={["preprocess_config", "process_multicrop_maxarea"]}
                            min={64 * 64}
                            max={2048 * 2048}
                            step={1}
                          />

                          <ProFormSelect
                            label="Resizing objective"
                            name={["preprocess_config", "process_multicrop_objective"]}
                            options={[
                              {label: "Maximize area", value: "Maximize area"},
                              {label: "Minimize error", value: "Minimize error"}
                            ]}
                            initialValue="Maximize area"
                          />

                          <ProFormSlider
                            label="Error threshold"
                            name={["preprocess_config", "process_multicrop_threshold"]}
                            min={0}
                            max={1}
                            step={0.01}
                          />
                        </ProFormGroup>
                      );
                    }}
                  </ProFormDependency>
                </>
              )
            },
            {
              label: "Train",
              key: "train",
              children: (
                <>
                  <ProFormGroup>
                    <ProFormDigit
                      label="Step"
                      name={"step"}
                      min={100}
                    />
                  </ProFormGroup>
                </>
              )
            },
            {
              label: "From Model",
              key: "fromModel",
              forceRender: true,
              children: (
                <div>
                  <ProFormText label={"Pretrained model name or path"}
                               name={["train_param", "pretrained_model_name_or_path"]} required/>
                  <ProFormSelect
                    label={"Save model as"}
                    name={["train_param", "save_model_as"]}
                    options={[{label: "ckpt", value: "ckpt"}, {label: "safetensors", value: "safetensors"}]}
                  />
                  <ProFormGroup>
                    <ProFormSwitch label={"v2"} name={["train_param", "v2"]}/>
                    <ProFormSwitch label={"v_parameterization"} name={["train_param", "v_parameterization"]}/>
                  </ProFormGroup>
                  <ProFormText label={"output name"} name={["train_param", "output_name"]} required/>
                  <ProFormText label={"Training comment"} name={["train_param", "training_comment"]} required/>
                </div>
              )
            },
            {
              label: "Parameters",
              key: "parameters",
              forceRender: true,
              children: (
                <div>
                  <ProFormGroup>
                    <ProFormSelect
                      label={"LoRA type"}
                      name={["train_param", "LoRA_type"]}
                      width={"md"}
                      options={[{label: "Kohya LoCon", value: "Kohya LoCon"}, {
                        label: "LyCORIS/LoCon",
                        value: "LyCORIS/LoCon"
                      }, {label: "LyCORIS/LoHa", value: "LyCORIS/LoHa"}, {label: "Standard", value: "Standard"}]}
                    />
                    <ProFormText name={["train_param", "network_weights"]} label={"LoRA network weights"}
                                 width={"xl"}/>
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormDigit name={["train_param", "train_batch_size"]} label={"Train batch size"}/>
                    <ProFormText name={["train_param", "epoch"]} label={"Epoch"}/>
                    <ProFormDigit name={["train_param", "save_every_n_epochs"]} label={"Save every n epochs"}/>
                    <ProFormText name={["train_param", "caption_extension"]} label={"Caption Extension"}/>
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormSelect
                      label={"Mixed Precision"}
                      options={['no', 'fp16', 'bf16'].map(it => ({value: it, label: it}))}
                      name={["train_param", "mixed_precision"]}
                    />
                    <ProFormSelect
                      label={"Save precision"}
                      options={['float', 'fp16', 'bf16'].map(it => ({value: it, label: it}))}
                      name={["train_param", "save_precision"]}
                    />
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormDigit name={["train_param", "num_cpu_threads_per_process"]}
                                  label={"Number of CPU threads per core"}/>
                    <ProFormSwitch name={["train_param", "cache_latents"]} label={"Cache latents"}/>
                    <ProFormDigit name={["train_param", "seed"]} label={"Seed"}/>
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormDigit name={["train_param", "learning_rate"]} label={"Learning rate"} width={"md"}/>
                    <ProFormSelect
                      label={"LR Scheduler"}
                      options={['adafactor', 'constant', 'constant_with_warmup', 'cosine', 'cosine_with_restarts', 'linear', 'polynomial',].map(it => ({
                        value: it,
                        label: it
                      }))}
                      name={["train_param", "lr_scheduler"]}
                      width={"lg"}
                    />
                    <ProFormText label={"LR warmup (% of steps)"} name={["train_param", "lr_warmup_steps"]}
                                 width={"md"}/>
                    <ProFormSelect
                      label={"Optimizer"}
                      options={[{label: 'AdamW', value: 'AdamW'}, {
                        label: 'AdamW8bit',
                        value: 'AdamW8bit'
                      }, {label: 'Adafactor', value: 'Adafactor'}, {
                        label: 'DAdaptation',
                        value: 'DAdaptation'
                      }, {label: 'Lion', value: 'Lion'}, {
                        label: 'SGDNesterov',
                        value: 'SGDNesterov'
                      }, {label: 'SGDNesterov8bit', value: 'SGDNesterov8bit'},]}
                      name={["train_param", "optimizer"]}
                      width={"lg"}
                    />
                    <ProFormText name={["train_param", "optimizer_args"]} label={"Optimizer extra arguments"}
                                 width={"xl"}/>
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormDigit name={["train_param", "text_encoder_lr"]} label={"Text Encoder learning rate"}/>
                    <ProFormDigit name={["train_param", "unet_lr"]} label={"Unet learning rate"}/>
                    <ProFormSlider
                      label="Network Rank (Dimension)"
                      name={["train_param", "network_dim"]}
                      min={1}
                      max={1024}
                      step={1}
                      width={"xl"}
                    />
                    <ProFormSlider
                      label="Network Alpha"
                      name={["train_param", "network_alpha"]}
                      min={1}
                      max={1024}
                      step={1}
                    />
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormSlider
                      label="Convolution Rank (Dimension)"
                      name={["train_param", "conv_dim"]}
                      min={1}
                      max={1024}
                      step={1}
                      width={"xl"}
                    />
                    <ProFormSlider
                      label="Network Alpha"
                      name={["train_param", "conv_alpha"]}
                      min={1}
                      max={1024}
                      step={1}
                    />
                  </ProFormGroup>
                  <ProFormGroup>
                    <ProFormText
                      label="Resolution"
                      name={["train_param", "resolution"]}
                      placeholder="512,512"
                    />
                    <ProFormSlider
                      label="Stop text encoder training"
                      name={["train_param", "stop_text_encoder_training_pct"]}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <ProFormSwitch
                      label="Enable buckets"
                      name={["train_param", "enable_bucket"]}
                    />
                  </ProFormGroup>
                  <ProFormGroup title={"Advance"}>
                    <ProFormGroup>
                      <ProFormSwitch
                        label="No token padding"
                        name={["train_param", "no_token_padding"]}
                      />
                      <ProFormDigit
                        label="Gradient accumulate steps"
                        name={["train_param", "gradient_accumulation_steps"]}
                        min={1}
                      />
                    </ProFormGroup>
                    <ProFormGroup>
                      <ProFormDigit
                        label="Prior loss weight"
                        name={["train_param", "prior_loss_weight"]}
                        initialValue={1.0}
                        min={0.0}
                      />
                      <ProFormDigit
                        label="LR number of cycles"
                        name={["train_param", "lr_scheduler_num_cycles"]}
                        placeholder="(Optional) For Cosine with restart and polynomial only"
                      />
                      <ProFormDigit
                        label="LR power"
                        name={["train_param", "lr_scheduler_power"]}
                        placeholder="(Optional) For Cosine with restart and polynomial only"
                      />
                    </ProFormGroup>
                    <ProFormText
                      label="Additional parameters"
                      name={["train_param", "additional_parameters"]}
                      placeholder="(Optional) Use to provide additional parameters not handled by the GUI. Eg: --some_parameters value"
                    />
                    <ProFormGroup>
                      <ProFormDigit
                        label="Keep n tokens"
                        name={["train_param", "keep_tokens"]}
                      />
                      <ProFormSlider
                        label="Clip skip"
                        name={["train_param", "clip_skip"]}
                        min={1}
                        max={12}
                        step={1}
                      />
                      <ProFormSelect
                        label="Max Token Length"
                        name={["train_param", "max_token_length"]}
                        options={[
                          {
                            label: '75',
                            value: 75,
                          },
                          {
                            label: '150',
                            value: 150,
                          },
                          {
                            label: '225',
                            value: 225,
                          },]}
                      />
                      <ProFormSwitch
                        label="Full fp16 training (experimental)"
                        name={["train_param", "full_fp16"]}
                      />
                    </ProFormGroup>
                    <ProFormGroup>
                      <ProFormSwitch
                        label="Gradient checkpointing"
                        name={["train_param", "gradient_checkpointing"]}
                      />
                      <ProFormSwitch
                        label="Shuffle caption"
                        name={["train_param", "shuffle_caption"]}
                      />
                      <ProFormSwitch
                        label="Persistent data loader"
                        name={["train_param", "persistent_data_loader_workers"]}
                      />
                      <ProFormSwitch
                        label="Memory efficient attention"
                        name={["train_param", "mem_eff_attn"]}
                      />
                    </ProFormGroup>

                    <ProFormGroup>
                      <ProFormSwitch
                        label="Use xformers"
                        name={["train_param", "xformers"]}
                      />
                      <ProFormSwitch
                        label="Color augmentation"
                        name={["train_param", "color_aug"]}
                      />
                      <ProFormSwitch
                        label="Flip augmentation"
                        name={["train_param", "flip_aug"]}
                      />
                    </ProFormGroup>
                    <ProFormGroup>
                      <ProFormSwitch
                        label="Don't upscale bucket resolution"
                        name={["train_param", "bucket_no_upscale"]}
                      />
                      <ProFormSlider
                        label="Bucket resolution steps"
                        name={["train_param", "bucket_reso_steps"]}
                      />
                      <ProFormSwitch
                        label="Random crop instead of center crop"
                        name={["train_param", "random_crop"]}
                      />
                      <ProFormText
                        label="Noise offset (0 - 1)"
                        name={["train_param", "noise_offset"]}
                        placeholder="(Oprional) eg: 0.1"
                      />
                    </ProFormGroup>
                    <ProFormGroup>
                      <ProFormDigit
                        label="Dropout caption every n epochs"
                        name={["train_param", "caption_dropout_every_n_epochs"]}
                      />
                      <ProFormSlider
                        label="Rate of caption dropout"
                        name={["train_param", "caption_tag_dropout_rate"]}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                      <ProFormSlider
                        label="VAE batch size"
                        name={["train_param", "vae_batch_size"]}
                        min={0}
                        max={32}
                        step={1}
                      />
                    </ProFormGroup>
                    <ProFormGroup>
                      <ProFormDigit
                        label="Max train epoch"
                        name={["train_param", "max_train_epochs"]}
                        placeholder="(Optional) Override number of epoch"
                      />
                      <ProFormDigit
                        label="Max num workers for DataLoader"
                        name={["train_param", "max_data_loader_n_workers"]}
                        placeholder="(Optional) Override number of epoch. Default: 8"
                      />
                    </ProFormGroup>

                  </ProFormGroup>
                  <ProFormGroup title={"Sample images config"}>
                    <ProFormGroup>
                      <ProFormDigit
                        label="Sample every n steps"
                        name={["train_param", "sample_every_n_steps"]}
                        min={0}
                        fieldProps={{precision: 0}}
                      />
                      <ProFormDigit
                        label="Sample every n epochs"
                        name={["train_param", "sample_every_n_epochs"]}
                        min={0}
                        fieldProps={{precision: 0}}
                      />
                      <ProFormSelect
                        label="Sample sampler"
                        name={["train_param", "sample_sampler"]}
                        options={[
                          {
                            value: 'ddim',
                            label: 'ddim',
                          },
                          {
                            value: 'pndm',
                            label: 'pndm',
                          },
                          {
                            value: 'lms',
                            label: 'lms',
                          },
                          {
                            value: 'euler',
                            label: 'euler',
                          },
                          {
                            value: 'euler_a',
                            label: 'euler_a',
                          },
                          {
                            value: 'heun',
                            label: 'heun',
                          },
                          {
                            value: 'dpm_2',
                            label: 'dpm_2',
                          },
                          {
                            value: 'dpm_2_a',
                            label: 'dpm_2_a',
                          },
                          {
                            value: 'dpmsolver',
                            label: 'dpmsolver',
                          },
                          {
                            value: 'dpmsolver++',
                            label: 'dpmsolver++',
                          },
                          {
                            value: 'dpmsingle',
                            label: 'dpmsingle',
                          },
                          {
                            value: 'k_lms',
                            label: 'k_lms',
                          },
                          {
                            value: 'k_euler',
                            label: 'k_euler',
                          },
                          {
                            value: 'k_euler_a',
                            label: 'k_euler_a',
                          },
                          {
                            value: 'k_dpm_2',
                            label: 'k_dpm_2',
                          },
                          {
                            value: 'k_dpm_2_a',
                            label: 'k_dpm_2_a',
                          }
                        ]}
                      />
                    </ProFormGroup>
                    <ProFormTextArea
                      width={"xl"}
                      label="Sample prompts"
                      name={["train_param", "sample_prompts"]}
                      placeholder="masterpiece, best quality, 1girl, in white shirts, upper body, looking at viewer, simple background --n low quality, worst quality, bad anatomy,bad composition, poor, low effort --w 768 --h 768 --d 1 --l 7.5 --s 28"
                    />
                  </ProFormGroup>
                </div>
              )
            }
          ]}
        />
      </ProForm>
    </Drawer>
  )
}
export default LoraConfigDrawer
