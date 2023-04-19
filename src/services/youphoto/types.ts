declare namespace YouPhotoAPI {
  type DeleteLibraryTaskOutput = {
    id: number;
    path: string;
    current: number;
    total: number;
    name: string;
  }
  type ServiceInfo = {
    name: string
    deepdanbooruEnable: boolean
    success: boolean
  }
  type ScanLibraryTaskOutput = {
    id: number;
    path: string;
    current: number;
    total: number;
    currentPath: string;
    currentName: string;
    name: string;
  }
  type LoraTrainOutput = {
    step: number;
    epoch: number;
    totalEpoch: number;
    totalStep: number;
    allStep: number;
    allTotalStep: number;
    progress: number;
    libraryName: string;
    libraryId: number;
  }
  type YouPhotoTaskOutput = DeleteLibraryTaskOutput | ScanLibraryTaskOutput | LoraTrainOutput
  type PhotoColor = {
    cnt: number,
    value: string,
    percent: number,
    rank: number,
  }
  type Classify = {
    label: string,
    prob: number,
  }
  type DeepdanbooruResult = {
    tag: string
    prob: number
  }
  type Photo = {
    id: number,
    name: string,
    thumbnail: string,
    created: string,
    updated: string,
    width: number,
    height: number,
    domain?: string,
    imageColors?: PhotoColor[],
    classify?: Classify[],
    deepdanbooruResult?: DeepdanbooruResult[]
  }

  type NearImage = {
    image: Photo,
    avgDistance: number,
  }

  export interface SDWModel {
    title: string;
    model_name: string;
    hash: string;
    sha256: string;
    filename: string;
    config: null;
  }

  export interface SDWOption {
    samples_save: boolean;
    samples_format: string;
    samples_filename_pattern: string;
    save_images_add_number: boolean;
    grid_save: boolean;
    grid_format: string;
    grid_extended_filename: boolean;
    grid_only_if_multiple: boolean;
    grid_prevent_empty_spots: boolean;
    n_rows: number;
    enable_pnginfo: boolean;
    save_txt: boolean;
    save_images_before_face_restoration: boolean;
    save_images_before_highres_fix: boolean;
    save_images_before_color_correction: boolean;
    jpeg_quality: number;
    webp_lossless: boolean;
    export_for_4chan: boolean;
    img_downscale_threshold: number;
    target_side_length: number;
    img_max_size_mp: number;
    use_original_name_batch: boolean;
    use_upscaler_name_as_suffix: boolean;
    save_selected_only: boolean;
    do_not_add_watermark: boolean;
    temp_dir: string;
    clean_temp_dir_at_start: boolean;
    outdir_samples: string;
    outdir_txt2img_samples: string;
    outdir_img2img_samples: string;
    outdir_extras_samples: string;
    outdir_grids: string;
    outdir_txt2img_grids: string;
    outdir_img2img_grids: string;
    outdir_save: string;
    save_to_dirs: boolean;
    grid_save_to_dirs: boolean;
    use_save_to_dirs_for_ui: boolean;
    directories_filename_pattern: string;
    directories_max_prompt_words: number;
    ESRGAN_tile: number;
    ESRGAN_tile_overlap: number;
    realesrgan_enabled_models: string[];
    upscaler_for_img2img: null;
    face_restoration_model: string;
    code_former_weight: number;
    face_restoration_unload: boolean;
    show_warnings: boolean;
    memmon_poll_rate: number;
    samples_log_stdout: boolean;
    multiple_tqdm: boolean;
    print_hypernet_extra: boolean;
    unload_models_when_training: boolean;
    pin_memory: boolean;
    save_optimizer_state: boolean;
    save_training_settings_to_txt: boolean;
    dataset_filename_word_regex: string;
    dataset_filename_join_string: string;
    training_image_repeats_per_epoch: number;
    training_write_csv_every: number;
    training_xattention_optimizations: boolean;
    training_enable_tensorboard: boolean;
    training_tensorboard_save_images: boolean;
    training_tensorboard_flush_every: number;
    sd_model_checkpoint: string;
    sd_checkpoint_cache: number;
    sd_vae_checkpoint_cache: number;
    sd_vae: string;
    sd_vae_as_default: boolean;
    inpainting_mask_weight: number;
    initial_noise_multiplier: number;
    img2img_color_correction: boolean;
    img2img_fix_steps: boolean;
    img2img_background_color: string;
    enable_quantization: boolean;
    enable_emphasis: boolean;
    enable_batch_seeds: boolean;
    comma_padding_backtrack: number;
    CLIP_stop_at_last_layers: number;
    upcast_attn: boolean;
    use_old_emphasis_implementation: boolean;
    use_old_karras_scheduler_sigmas: boolean;
    no_dpmpp_sde_batch_determinism: boolean;
    use_old_hires_fix_width_height: boolean;
    interrogate_keep_models_in_memory: boolean;
    interrogate_return_ranks: boolean;
    interrogate_clip_num_beams: number;
    interrogate_clip_min_length: number;
    interrogate_clip_max_length: number;
    interrogate_clip_dict_limit: number;
    interrogate_clip_skip_categories: any[];
    interrogate_deepbooru_score_threshold: number;
    deepbooru_sort_alpha: boolean;
    deepbooru_use_spaces: boolean;
    deepbooru_escape: boolean;
    deepbooru_filter_tags: string;
    extra_networks_default_view: string;
    extra_networks_default_multiplier: number;
    extra_networks_add_text_separator: string;
    sd_hypernetwork: string;
    return_grid: boolean;
    do_not_show_images: boolean;
    add_model_hash_to_info: boolean;
    add_model_name_to_info: boolean;
    disable_weights_auto_swap: boolean;
    send_seed: boolean;
    send_size: boolean;
    font: string;
    js_modal_lightbox: boolean;
    js_modal_lightbox_initially_zoomed: boolean;
    show_progress_in_title: boolean;
    samplers_in_dropdown: boolean;
    dimensions_and_batch_together: boolean;
    keyedit_precision_attention: number;
    keyedit_precision_extra: number;
    quicksettings: string;
    hidden_tabs: any[];
    ui_reorder: string;
    ui_extra_networks_tab_reorder: string;
    localization: string;
    show_progressbar: boolean;
    live_previews_enable: boolean;
    show_progress_grid: boolean;
    show_progress_every_n_steps: number;
    show_progress_type: string;
    live_preview_content: string;
    live_preview_refresh_period: number;
    hide_samplers: any[];
    eta_ddim: number;
    eta_ancestral: number;
    ddim_discretize: string;
    s_churn: number;
    s_tmin: number;
    s_noise: number;
    eta_noise_seed_delta: number;
    always_discard_next_to_last_sigma: boolean;
    uni_pc_variant: string;
    uni_pc_skip_type: string;
    uni_pc_order: number;
    uni_pc_lower_order_final: boolean;
    postprocessing_enable_in_main_ui: any[];
    postprocessing_operation_order: any[];
    upscaling_max_images_in_cache: number;
    disabled_extensions: any[];
    sd_checkpoint_hash: string;
    sd_lora: string;
    lora_apply_to_outputs: boolean;
  }

  export interface Text2ImageResponse {
    images: string[];
    parameters: Text2ImageResponseParameters;
    info: string;
  }

  export interface Text2ImageResponseParameters {
    enable_hr: boolean;
    denoising_strength: number;
    firstphase_width: number;
    firstphase_height: number;
    hr_scale: number;
    hr_upscaler: null;
    hr_second_pass_steps: number;
    hr_resize_x: number;
    hr_resize_y: number;
    prompt: string;
    styles: null;
    seed: number;
    subseed: number;
    subseed_strength: number;
    seed_resize_from_h: number;
    seed_resize_from_w: number;
    sampler_name: null;
    batch_size: number;
    n_iter: number;
    steps: number;
    cfg_scale: number;
    width: number;
    height: number;
    restore_faces: boolean;
    tiling: boolean;
    do_not_save_samples: boolean;
    do_not_save_grid: boolean;
    negative_prompt: string;
    eta: null;
    s_churn: number;
    s_tmax: null;
    s_tmin: number;
    s_noise: number;
    override_settings: null;
    override_settings_restore_afterwards: boolean;
    script_args: any[];
    sampler_index: string;
    script_name: null;
    send_images: boolean;
    save_images: boolean;
  }

  export interface Sampler {
    name: string;
    aliases: string[];
  }

  export interface Upscaler {
    name: string
    model_name?: string;
    model_path?: string;
    scale: number;
  }

  export interface SDWProgress {
    progress: number;
    eta_relative: number;
    state: SDWProgressState;
    current_image: string;
    textinfo: string;
  }

  export interface SDWProgressState {
    skipped: boolean;
    interrupted: boolean;
    job: string;
    job_count: number;
    job_timestamp: string;
    job_no: number;
    sampling_step: number;
    sampling_steps: number;
  }

  export interface SDWConfig {
    id: number;
    name: string;
    config: string;
    createAt: string;
    updateAt: string;
  }

  export interface LoraConfig {
    id: number;
    name: string;
    config: string;
    createAt: string;
    updateAt: string;
  }
}


