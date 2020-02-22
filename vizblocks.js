class VizBlocks {
  constructor (runtime) {
    this.runtime = runtime;

    /**
     * The ID of the renderer Drawable corresponding to the pen layer.
     * @type {int}
     * @private
     */
    this._penDrawableId = -1;

    /**
     * The ID of the renderer Skin corresponding to the pen layer.
     * @type {int}
     * @private
     */
    this._penSkinId = -1;
  }

  /**
   * The key to load & store a target's pen-related state.
   * @type {string}
   */
  static get STATE_KEY () {
      return 'Scratch.pen';
  }

  /**
   * The default pen state, to be used when a target has no existing pen state.
   * @type {PenState}
   */
  static get DEFAULT_PEN_STATE () {
    return {
      penDown: false,
      color: 66.66,
      saturation: 100,
      brightness: 100,
      transparency: 0,
      _shade: 50, // Used only for legacy `change shade by` blocks
      penAttributes: {
        color4f: [0, 0, 1, 1],
        diameter: 1
      }
    };
  }

  getInfo() {
    return {
      id: 'vizblocks',
      name: 'VizBlocks',
      blocks: [
        {
          opcode: 'drawXAxis',
          blockType: Scratch.BlockType.COMMAND,　
          text: 'Draw x-axis'
        }
      ]
    }
  }

  drawXAxis() {
    console.log('drawing line');
    const target = Scratch.RenderedTarget;
    console.log(target);
    console.log(Scratch.runtime);
    console.log(this.runtime.renderer);
    console.log(this._penDrawableId);

    const penSkinId = this._getPenLayerID();
    if (penSkinId >= 0) {
      const penState = this._getPenState(target);
      this.runtime.renderer.penLine(penSkinId, penState.penAttributes, 0, 0, 100, 0);
      this.runtime.requestRedraw();
  }
  }

  /**
   * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
   * the pen Skin doesn't yet exist, create it.
   * @returns {int} the Skin ID of the pen layer, or -1 on failure.
   * @private
   */
  _getPenLayerID () {
    if (this._penSkinId < 0 && this.runtime.renderer) {
        this._penSkinId = this.runtime.renderer.createPenSkin();
        this._penDrawableId = this.runtime.renderer.createDrawable(Scratch.StageLayering.PEN_LAYER);
        this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {skinId: this._penSkinId});
    }
    return this._penSkinId;
  }

  /**
   * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
   * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
   * @private
   */
  _getPenState (target) {
    let penState = target.getCustomState(VizBlocks.STATE_KEY);
    if (!penState) {
        penState = Scratch.Clone.simple(VizBlocks.DEFAULT_PEN_STATE);
        target.setCustomState(VizBlocks.STATE_KEY, penState);
    }
    return penState;
  }
}

Scratch.extensions.register(new VizBlocks());
