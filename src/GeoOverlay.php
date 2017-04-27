<?php

namespace Biigle\Modules\Geo;

use File;
use Biigle\Volume;
use Illuminate\Database\Eloquent\Model;

class GeoOverlay extends Model
{
    /**
     * Don't maintain timestamps for this model.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes hidden in the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'volume_id',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'top_left_lng' => 'float',
        'top_left_lat' => 'float',
        'bottom_right_lng' => 'float',
        'bottom_right_lat' => 'float',
    ];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot() {
        parent::boot();

        // Delete the overlay image file after the model was deleted.
        static::deleted(function($overlay) {
            if (File::exists($overlay->path)) {
                File::delete($overlay->path);
            }

            if (empty(File::files($overlay->directory))) {
                File::deleteDirectory($overlay->directory);
            }
        });
    }

    /**
     * The volume, this overlay belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function volume()
    {
        return $this->belongsTo(Volume::class);
    }

    /**
     * Get the local path to the overlay image directory.
     *
     * @return string
     */
    public function getDirectoryAttribute()
    {
        return config('geo.overlay_storage')."/{$this->volume_id}";
    }

    /**
     * Get the local path to the overlay image file.
     *
     * @return string
     */
    public function getPathAttribute()
    {
        return $this->directory."/{$this->id}";
    }
}
