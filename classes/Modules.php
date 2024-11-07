<?php

namespace CatalogEnquiry;

/**
 * Catalog Modules Class
 *
 * @version		2.2.0
 * @package		MultivendorX
 * @author 		MultiVendorX
 */

class Modules {
    /**
     * Option's table key for active module list.
     * @var string
     */
    const ACTIVE_MODULES_DB_KEY = "catalog_all_active_module_list";

    /**
     * List of all module.
     * @var array
     */
    private $modules = [];

    /**
     * List of all active module.
     * @var array
     */
    private $active_modules = [];

    /**
     * State for modules are activated or not.
     * @var bool
     */
    private static $module_activated = false;

    /**
     * Container that store the object of active module
     * @var array
     */

    private $container = [];

    function __construct() {
    }

    /**
     * Get list of all multivendorX module.
     * @return array
     */
    public function get_all_modules() {
        if ( ! $this->modules ) {

            $this->modules = apply_filters( 'catalog_modules', [
                'catalog' => [
                    'id'             => 'catalog',
                    'module_file'    => Catalog()->plugin_path . 'modules/Catalog/Module.php',
                    'module_class'   => 'CatalogEnquiry\Catalog\Module',
                ],
                'enquiry' => [
                    'id'             => 'enquiry',
                    'module_file'    => Catalog()->plugin_path . 'modules/Enquiry/Module.php',
                    'module_class'   => 'CatalogEnquiry\Enquiry\Module',
                ],
                'quote'    => [
                    'id'             => 'quote',
                    'module_file'    => Catalog()->plugin_path . 'modules/Quote/Module.php',
                    'module_class'   => 'CatalogEnquiry\Quote\Module',
                ],
                // 'wholesale'    => [
                //     'id'             => 'wholesale',
                //     'module_file'    => Catalog()->plugin_path . 'modules/Wholesale/Module.php',
                //     'module_class'   => 'CatalogEnquiry\Wholesale\Module',
                // ],
            ]);
        }

        return $this->modules;
    }

    /**
     * Get all active modules
     * @return array
     */
    public function get_active_modules() {

        // If active modules are loaded return it
        if ( $this->active_modules ) {
            return $this->active_modules;
        }

        $this->active_modules = get_option( self::ACTIVE_MODULES_DB_KEY, [] );

        return $this->active_modules;
    }

    /**
     * Load all active modules
     * @return void
     */
    public function load_active_modules() {
        if ( self::$module_activated ) {
            return;
        }

        $license_active    = Utill::is_pro_active();
        $active_modules    = $this->get_active_modules();
        $all_modules       = $this->get_all_modules();
        $activated_modules = [];

        foreach ( $active_modules as $modules_id ) {
            if ( ! isset( $all_modules[ $modules_id ] ) ) {
                continue;
            }

            $module = $all_modules[ $modules_id ];

        
            // Check if the module is avialable
            if ( ! $this->is_module_avialable( $module, $license_active ) ) {
                continue;
            }

            // Store the module as active module
            if ( file_exists( $module['module_file'] ) ) {
                $activated_modules[] = $modules_id;
            }

            // Activate the module
            if ( file_exists( $module['module_file'] ) && ! in_array( $modules_id, $this->container ) ) {
                require_once $module['module_file'];

                $module_class = $module['module_class'];
                $this->container[ $modules_id ] = new $module_class();

                /**
                 * Module activation hook
                 * 
                 * @param object $name module object
                 */
                do_action( 'catalog_activated_module_' . $modules_id, $this->container[ $modules_id ] );
            }
        }

        // store activated module as active module
        if ( $activated_modules !== $active_modules ) {
            update_option( self::ACTIVE_MODULES_DB_KEY, $activated_modules );
        }

        self::$module_activated = true;
    }

    /**
     * Check a perticular module is avialable or not.
     * @param array $module
     * @param bool $license_active
     * @return bool
     */
    private function is_module_avialable( $module, $license_active ) {
        $is_pro_module = $module['pro_module'] ?? false;

        // if it is free module
        if ( ! $is_pro_module ) {
            return true;
        }

        // if it is pro module
        if( $is_pro_module && $license_active ) {
            return true;
        }

        return false;
    }

    /**
     * Get list of all module's id
     * @return array
     */
    public function get_all_modules_ids() {
        $modules = $this->get_all_modules();
        return array_keys( $modules );
    }

    /**
     * Get all avialable modules.
     * @return array
     */
    public function get_avialable_modules() {
        $modules           = $this->get_all_modules();
        $license_active    = Utill::is_pro_active();
        $available_modules = [];

        foreach ( $modules as $module_id => $module ) {
            // Check if the module is avialable
            if ( ! $this->is_module_avialable( $module, $license_active ) ) {
                continue;
            }

            if ( file_exists( $module['module_file'] ) ) {
                $available_modules[] = $module['id'];
            }
        }

        return $available_modules;
    }

    /**
     * Activate modules
     * @param array $modules
     * @return array|mixed
     */
    public function activate_modules( $modules ) {
        $active_modules = $this->get_active_modules();

        $this->active_modules = array_unique( array_merge( $active_modules, $modules ) );

        update_option( self::ACTIVE_MODULES_DB_KEY, $this->active_modules );

        self::$module_activated = false;

        $this->load_active_modules();

        return $this->active_modules;
    }

    /**
     * Defactivate modules.
     * @param array $modules
     * @return void
     */
    public function deactivate_modules( $modules ) {
        $active_modules = $this->get_active_modules();

        foreach ( $modules as $module_id ) {
            $active_modules = array_diff( $active_modules, [ $module_id ] );
        }

        $active_modules = array_values( $active_modules );

        $this->active_modules = $active_modules;

        update_option( self::ACTIVE_MODULES_DB_KEY, $this->active_modules );

        add_action(
            'shutdown', function () use ( $modules ) {
                foreach ( $modules as $module_id ) {
                    /**
                     * Module deactivation hook
                     * @param object $module deactivated module object
                     */
                    do_action( 'catalog_deactivated_module_' . $module_id, $this->container[$module_id] );
                }
            }
        );

        return $this->active_modules;
    }
     
    /**
     * Get a module is avialable or not.
     * @param mixed $module_id
     * @return true
     */
    public function is_avialable( $module_id ) {
        $available_modules = $this->get_avialable_modules();

        return in_array( $module_id, $available_modules, true );
    }

    /**
     * Check a module is active or not
     * @param mixed $module_id
     * @return bool
     */
    public function is_active( $module_id ) {
        $active_modules = $this->get_active_modules();

        return in_array( $module_id, $active_modules, true );
    }
}